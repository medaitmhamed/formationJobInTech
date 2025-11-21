import { useEffect, useMemo, useState } from "react";
import UseFetch from "./hooks/use-fetch";
import useToggle from "./hooks/use-toggle";
import useLocalStorage from "../jour3/use-local-storage";
import { Building2, Eye, EyeOff, Mail, MapPin, Moon, Phone, Search, Sun } from "lucide-react";

const UserDirectory = () => {
  const { data, loading, error } = UseFetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  const [counter, setCounter] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtredData, setFiltredData] = useState([]);
  const [hideDetails, setHideDetails] = useToggle(false);
  const [theme , setTheme] = useLocalStorage("theme","Light");

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);


  const filtered = useMemo(() => {
    return data.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);
  

  useEffect(() => {
    setFiltredData(filtered);
  }, [filtered]);

  if (loading) {
    return (
      <div className="w-full h-svh bg-white flex items-center justify-center flex-col text-black gap-10">
        <h1>Loading...</h1>
        <div className="loading-spinner border-4 border-t-4 border-blue-500 border-t-gray-200  rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return(
    <div className="w-full h-svh bg-white flex items-center justify-center flex-col text-red-500 gap-10">
       <h1>Error: {error.message}</h1> 
        </div>
    )
  }
 return (
    <div className={`w-full min-h-screen ${theme === "Light" ? "bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 text-black" : "bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 text-white"}`}>
      <div className={`max-w-7xl mx-auto px-6 py-12 ${theme === "Light" ? "bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6" : "bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6"}`}>
        <h2 className={`text-5xl font-bold text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 ${theme === "Light" ? "text-black" : "text-white"}`}>
          Annuaire d'utilisateurs
        </h2>
        <p className={`text-center text-gray-500 mb-10 text-sm ${theme === "Light" ? "text-black" : "text-white"}`}>
          Dernière mise à jour: <span className="font-semibold text-blue-600">{counter}s</span>
        </p>
        
        <div className={`backdrop-blur-sm  rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-10 hover:shadow-2xl transition-shadow duration-300 ${theme === "Light" ? "bg-white" : "bg-gray-800"}`}>
          <div className={`flex flex-col sm:flex-row gap-4`}>
            <input
              className={`flex-1 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-400 text-gray-700 ${theme === "Light" ? "bg-white" : "bg-gray-800"}`}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom..."
            />
            <button
              className={`px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl cursor-pointer ${
                hideDetails
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                  : "bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
              }`}
              type="button"
              onClick={() => setHideDetails(!hideDetails)}
            >
              {hideDetails ? <div className="flex items-center gap-2"> <Eye/> <i> afficher les détails</i></div> : <div className="flex items-center gap-2"> <EyeOff/> <i>Masquer les détails</i></div>} 
            </button>
            <button
              className={`px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl cursor pointer ${
                theme === "Light" ? "bg-linear-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-800" : "bg-linear-to-r from-amber-200 to-amber-500 text-black hover:from-amber-300 hover:to-amber-600"
              }`}
              type="button"
              onClick={() => setTheme(theme === "Light" ? "Dark" : "Light")}
            >
              {theme === "Light" ? <div className="flex items-center gap-2"> <Moon/> <i>Changer en sombre</i></div> : <div className="flex items-center gap-2"> <Sun/> <i>Changer en clair</i></div>}
            </button>
          </div>
        </div>

        <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${theme === "Light" ? "bg-white" : "bg-gray-800"}`}>
          {filtredData.map((user) => (
            <div 
              key={user.id} 
              className={`group w-full rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 hover:border-blue-200 ${theme === "Light" ? "bg-white text-black" : "bg-gray-800 text-white shadow-md shadow-gray-500"}`}
            >
              <div className={`flex items-center justify-between mb-2 ${theme === "Light" ? "text-black" : "text-white"}`}>
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                  {user.name.split(" ")[0].charAt(0)+ user.name.split(" ")[1].charAt(0)}
                </div>
              </div>
              
              <h2 className={`text-lg font-bold ${theme === "Light" ? "text-black" : "text-white"} group-hover:text-blue-600 transition-colors line-clamp-2`}>
                {user.name}
              </h2>
              
              <p className="text-sm truncate flex items-center gap-2">
                <Mail className="text-blue-500 mt-0.5 w-5"/>
                {user.email}
              </p>
              
              {!hideDetails && (
                <div className="space-y-2.5 animate-in fade-in duration-300">
                  <p className="text-sm  flex items-start gap-2">
                    <Phone className="text-blue-500 mt-0.5 w-5"/>
                    <span className="flex-1">{user.phone}</span>
                  </p>
                  <p className="text-sm  flex items-start gap-2">
                    <Building2 className="text-blue-500 mt-0.5 w-5"/>
                    <span className="flex-1 font-medium">{user.company.name}</span>
                  </p>
                  <p className="text-sm  flex items-start gap-2">
                    <MapPin className="text-blue-500 mt-0.5 w-5"/>
                    <span className="flex-1">{user.address.city}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtredData.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"><Search/></div>
            <p className="text-xl text-gray-400 font-medium">
              Aucun utilisateur trouvé
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDirectory;
