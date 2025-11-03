
// Cache et historique
    const cache = new Map();
    const history = [];
    const MAX_HISTORY = 10;
    let currentController = null;

    // Telemetry
    let telemetry = {
      httpStatus: '—',
      totalTime: '—',
      fromCache: '—',
      retries: 0
    };

    // Éléments DOM
    const qInput = document.getElementById('q');
    const searchBtn = document.getElementById('searchBtn');
    const surpriseBtn = document.getElementById('surpriseBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const statusDiv = document.getElementById('status');
    const cardDiv = document.getElementById('card');
    const emptyState = document.getElementById('emptyState');
    const fetchedHeader = document.getElementById('fetchedHeader');
    const fetchedId = document.getElementById('fetchedId');
    const fetchedName = document.getElementById('fetchedName');
    const pokemonCard = document.getElementById('pokemonCard');
    const historyList = document.getElementById('history');

    // Console logging avec couleurs
    const log = {
      callback: (msg) => console.log('%c[CALLBACK]%c ' + msg, 'color: #fbbf24; font-weight: bold', 'color: #cbd5e1'),
      promise: (msg) => console.log('%c[PROMISE]%c ' + msg, 'color: #818cf8; font-weight: bold', 'color: #cbd5e1'),
      async: (msg) => console.log('%c[ASYNC/AWAIT]%c ' + msg, 'color: #10b981; font-weight: bold', 'color: #cbd5e1'),
      abort: (msg) => console.log('%c[ABORT]%c ' + msg, 'color: #ef4444; font-weight: bold', 'color: #cbd5e1'),
      retry: (msg) => console.log('%c[RETRY]%c ' + msg, 'color: #f59e0b; font-weight: bold', 'color: #cbd5e1'),
      cache: (msg) => console.log('%c[CACHE]%c ' + msg, 'color: #06b6d4; font-weight: bold', 'color: #cbd5e1')
    };

    // Utilitaire: Fetch avec timeout
    function fetchWithTimeout(url, options = {}) {
      const { timeout = 8000, signal } = options;
      
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
      ]);
    }

    // Utilitaire: Retry avec backoff
    async function retry(fn, { retries = 3, backoffMs = 1000 } = {}) {
      for (let i = 0; i < retries; i++) {
        try {
          const result = await fn();
          if (i > 0) {
            log.retry(`✓ Success after ${i} retry(ies)`);
            telemetry.retries = i;
          }
          return result;
        } catch (error) {
          const isLastAttempt = i === retries - 1;
          const isServerError = error.status >= 500;
          
          if (isLastAttempt || !isServerError) {
            throw error;
          }
          
          const delay = backoffMs * Math.pow(2, i);
          log.retry(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
          telemetry.retries = i + 1;
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Style 1: Callback (démonstration)
    function fakeCallbackPipeline(query, callback) {
      log.callback('→ Starting callback pipeline...');
      log.callback('  Step 1: Normalizing input...');
      
      setTimeout(() => {
        const normalized = query.toLowerCase().trim();
        log.callback(`  ✓ Normalized: "${normalized}"`);
        
        log.callback('  Step 2: Validating...');
        setTimeout(() => {
          if (!normalized) {
            log.callback('  ✗ Validation failed: empty query');
            callback(new Error('Query vide'), null);
          } else {
            log.callback('  ✓ Validation passed');
            log.callback('← Callback pipeline complete, passing to Promise chain...');
            callback(null, normalized);
          }
        }, 200);
      }, 200);
    }

    // Style 2: Promise chaining
    function fetchPokemonThenStyle(query) {
      const url = `https://pokeapi.co/api/v2/pokemon/${query}`;
      log.promise(`→ Fetching ${url}`);
      
      return fetch(url)
        .then(response => {
          log.promise(`← Received response: ${response.status} ${response.statusText}`);
          telemetry.httpStatus = response.status;
          
          if (!response.ok) {
            throw new Error(response.status === 404 ? 'Pokémon not found' : 'Network error');
          }
          return response.json();
        })
        .then(data => {
          log.promise(`✓ Parsed JSON data for ${data.name}`);
          return {
            id: data.id,
            name: data.name,
            sprite: data.sprites.front_default,
            types: data.types.map(t => t.type.name),
            stats: data.stats.map(s => ({
              name: s.stat.name,
              value: s.base_stat
            }))
          };
        });
    }

    // Style 3: Async/Await (production)
    async function fetchPokemon(query) {
      const startTime = performance.now();
      telemetry.retries = 0;
      
      // Vérifier le cache
      if (cache.has(query)) {
        const endTime = performance.now();
        telemetry.totalTime = (endTime - startTime).toFixed(0);
        telemetry.fromCache = '✓';
        telemetry.httpStatus = 'CACHED';
        log.cache(`✓ Serving ${query} from cache (${telemetry.totalTime}ms)`);
        updateTelemetryUI();
        return cache.get(query);
      }

      telemetry.fromCache = '—';
      const signal = currentController?.signal;

      log.async(`→ Starting async/await fetch for "${query}"`);

      try {
        log.async('  Fetching pokemon + species in parallel with Promise.all...');
        
        const [pokemonRes, speciesRes] = await Promise.all([
          retry(() => fetchWithTimeout(
            `https://pokeapi.co/api/v2/pokemon/${query}`,
            { signal, timeout: 8000 }
          )),
          retry(() => fetchWithTimeout(
            `https://pokeapi.co/api/v2/pokemon-species/${query}`,
            { signal, timeout: 8000 }
          )).catch(err => {
            log.async('  ⚠ Species fetch failed (non-critical), continuing...');
            return null;
          })
        ]);

        log.async(`  ✓ Pokemon response: ${pokemonRes.status}`);
        telemetry.httpStatus = pokemonRes.status;

        if (!pokemonRes.ok) {
          throw new Error(pokemonRes.status === 404 ? 'Pokémon not found' : 'Network error');
        }

        const pokemonData = await pokemonRes.json();
        log.async(`  ✓ Parsed pokemon data: ${pokemonData.name}`);
        
        const speciesData = speciesRes?.ok ? await speciesRes.json() : null;
        if (speciesData) {
          log.async(`  ✓ Parsed species data: ${speciesData.color?.name || 'unknown'} color`);
        }

        const result = {
          id: pokemonData.id,
          name: pokemonData.name,
          sprite: pokemonData.sprites.front_default || pokemonData.sprites.front_shiny,
          types: pokemonData.types.map(t => t.type.name),
          stats: pokemonData.stats.map(s => ({
            name: s.stat.name,
            value: s.base_stat
          })),
          color: speciesData?.color?.name || 'gray',
          flavorText: speciesData?.flavor_text_entries
            ?.find(entry => entry.language.name === 'en')
            ?.flavor_text.replace(/\f/g, ' ') || ''
        };

        // Mettre en cache
        cache.set(query, result);
        cache.set(result.id.toString(), result);
        log.cache(`✓ Cached result for ${query} and ${result.id}`);

        const endTime = performance.now();
        telemetry.totalTime = (endTime - startTime).toFixed(0);
        log.async(`← Async/await complete in ${telemetry.totalTime}ms`);
        
        updateTelemetryUI();
        return result;
      } catch (error) {
        const endTime = performance.now();
        telemetry.totalTime = (endTime - startTime).toFixed(0);
        
        if (error.name === 'AbortError') {
          log.abort('✗ Request aborted by user');
          throw new Error('Search cancelled');
        }
        log.async(`✗ Error: ${error.message}`);
        updateTelemetryUI();
        throw error;
      }
    }

    // Mise à jour télémétrie
    function updateTelemetryUI() {
      document.getElementById('httpStatus').textContent = telemetry.httpStatus;
      document.getElementById('totalTime').textContent = telemetry.totalTime;
      document.getElementById('fromCache').textContent = telemetry.fromCache;
      document.getElementById('retries').textContent = telemetry.retries;
    }

    // Affichage du statut
    function setStatus(type, message) {
      statusDiv.className = `show ${type}`;
      statusDiv.textContent = message;
    }

    // Rendu du Pokémon
    function renderPokemon(pokemon) {
      const colorMap = {
        red: '#ef4444', blue: '#3b82f6', yellow: '#fbbf24', green: '#10b981',
        black: '#1f2937', brown: '#92400e', purple: '#a855f7', gray: '#6b7280',
        white: '#f3f4f6', pink: '#ec4899'
      };

      fetchedHeader.style.display = 'block';
      fetchedId.textContent = pokemon.id;
      fetchedName.textContent = pokemon.name;
      
      document.querySelector('.card-container').style.borderColor = colorMap[pokemon.color] || '#fbbf24';
      document.querySelector('.pokemon-card').style.borderColor = colorMap[pokemon.color] || '#fbbf24';
      
      // Calculer stats principales
      const hp = pokemon.stats.find(s => s.name === 'hp')?.value || 0;
      const attack = pokemon.stats.find(s => s.name === 'attack')?.value || 0;
      const defense = pokemon.stats.find(s => s.name === 'defense')?.value || 0;
      const spAtk = pokemon.stats.find(s => s.name === 'special-attack')?.value || 0;
      const spDef = pokemon.stats.find(s => s.name === 'special-defense')?.value || 0;
      const speed = pokemon.stats.find(s => s.name === 'speed')?.value || 0;
      
      pokemonCard.innerHTML = `
        <div class="card-header">
          <div class="sprite-container">
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
          </div>
          <div class="pokemon-info">
            <div class="pokemon-title">${pokemon.name}</div>
            <div class="pokemon-id">#${pokemon.id}</div>
            <div class="types-label">types: ${pokemon.types.join(' / ')}</div>
            <div class="types">
              ${pokemon.types.map(type => 
                `<span class="type-badge type-${type}">${type}</span>`
              ).join('')}
            </div>
          </div>
        </div>
        
        ${pokemon.flavorText ? `
          <div class="flavor-text">${pokemon.flavorText}</div>
        ` : ''}
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">HP</div>
            <div class="stat-value">${hp}</div>
            <div class="stat-sublabel">base</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">ATK</div>
            <div class="stat-value">${attack}</div>
            <div class="stat-sublabel">base</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">DEF</div>
            <div class="stat-value">${defense}</div>
            <div class="stat-sublabel">base</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">SpA</div>
            <div class="stat-value">${spAtk}</div>
            <div class="stat-sublabel">base</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">SpD</div>
            <div class="stat-value">${spDef}</div>
            <div class="stat-sublabel">base</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">SPE</div>
            <div class="stat-value">${speed}</div>
            <div class="stat-sublabel">base</div>
          </div>
        </div>
      `;
      
      emptyState.style.display = 'none';
      cardDiv.classList.add('show');
    }

    // Ajouter à l'historique
    function addToHistory(pokemon) {
      const entry = `#${pokemon.id} ${pokemon.name}`;
      
      if (!history.some(h => h.id === pokemon.id)) {
        history.unshift({ id: pokemon.id, name: pokemon.name, display: entry });
        if (history.length > MAX_HISTORY) {
          history.pop();
        }
        updateHistoryUI();
      }
    }

    // Mise à jour UI historique
    function updateHistoryUI() {
      if (history.length === 0) {
        historyList.innerHTML = '<li class="history-item" style="cursor: default; opacity: 0.5;">No searches yet</li>';
      } else {
        historyList.innerHTML = history.map(h => 
          `<li class="history-item" onclick="searchFromHistory('${h.id}')">${h.display}</li>`
        ).join('');
      }
    }

    // Recherche depuis historique
    window.searchFromHistory = function(id) {
      qInput.value = id;
      handleSearch();
    };

    // Gestionnaire de recherche principal
    async function handleSearch(query = null) {
      console.clear();
      console.log('%c═══════════════════════════════════════════════════════════', 'color: #475569');
      console.log('%c🔍 NEW SEARCH REQUEST', 'color: #fff; font-size: 14px; font-weight: bold');
      console.log('%c═══════════════════════════════════════════════════════════', 'color: #475569');
      
      const searchQuery = query || qInput.value.trim().toLowerCase();
      
      if (!searchQuery) {
        setStatus('error', '✗ Please enter a name or ID');
        return;
      }

      // Annuler la requête précédente
      if (currentController) {
        currentController.abort();
        log.abort('Previous request cancelled');
      }
      currentController = new AbortController();

      cancelBtn.style.display = 'inline-block';
      setStatus('loading', '⏳ Fetching...');

      // Démonstration callback
      fakeCallbackPipeline(searchQuery, async (err, normalized) => {
        if (err) {
          setStatus('error', `✗ ${err.message}`);
          cancelBtn.style.display = 'none';
          return;
        }

        try {
          const pokemon = await fetchPokemon(normalized);
          renderPokemon(pokemon);
          addToHistory(pokemon);
          setStatus('success', `✓ Fetched #${pokemon.id} ${pokemon.name}`);
          
          console.log('%c═══════════════════════════════════════════════════════════', 'color: #475569');
          console.log('%c✓ SEARCH COMPLETE', 'color: #10b981; font-size: 14px; font-weight: bold');
          console.log('%c═══════════════════════════════════════════════════════════', 'color: #475569');
        } catch (error) {
          setStatus('error', `✗ ${error.message}`);
          cardDiv.classList.remove('show');
          emptyState.style.display = 'block';
          fetchedHeader.style.display = 'none';
          
          console.log('%c═══════════════════════════════════════════════════════════', 'color: #475569');
          console.log('%c✗ SEARCH FAILED', 'color: #ef4444; font-size: 14px; font-weight: bold');
          console.log('%c═══════════════════════════════════════════════════════════', 'color: #475569');
        } finally {
          cancelBtn.style.display = 'none';
          currentController = null;
        }
      });
    }

    // Recherche aléatoire
    async function handleSurprise() {
      const randomId = Math.floor(Math.random() * 898) + 1;
      log.async(`🎲 Random ID selected: ${randomId}`);
      qInput.value = randomId.toString();
      await handleSearch(randomId.toString());
    }

    // Annuler la recherche
    function handleCancel() {
      if (currentController) {
        currentController.abort();
        currentController = null;
      }
      cancelBtn.style.display = 'none';
      setStatus('error', '✗ Search cancelled');
    }

    // Event listeners
    searchBtn.addEventListener('click', () => handleSearch());
    surpriseBtn.addEventListener('click', handleSurprise);
    cancelBtn.addEventListener('click', handleCancel);
    qInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    // Initialisation
    updateHistoryUI();
    updateTelemetryUI();
    console.log('%c🚀 PokeFetch+ Ready!', 'color: #818cf8; font-size: 16px; font-weight: bold');
    console.log('%cOpen this console to see detailed async pipeline logs', 'color: #94a3b8');
    console.log('%cTry searching for: pikachu, 25, charizard, 404, etc.', 'color: #94a3b8');
  