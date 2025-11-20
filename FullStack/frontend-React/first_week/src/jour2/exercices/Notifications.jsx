const Notifications = ({notifications}) => {
  return (
    <div style={{marginBottom: '20px'}}>
      {notifications.length > 0 && (
        notifications.map((notification, index) => (
          <div key={index}>{notification}</div>
        ))
      )}
    </div>
  )
}

export default Notifications