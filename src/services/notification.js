import React from "react";

const viewNotification = (type, message, notificationAlertRef) => {
    let options = {
      place: "br",
      message: (
        <div className="alert-text">
          <span data-notify="message">
            { message }
          </span>
        </div>
      ),
      type: type,
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
};

const Notification = {
  viewNotification,
};

export default Notification;