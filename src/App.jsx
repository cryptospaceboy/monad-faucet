import "./App.css"; // make sure this file exists

export default function App() {
  return (
    <div className="container">
      <div className="box">
        <h1 className="title">We'll Be Back Soon!</h1>
        <p className="message">
          Our app is currently down for maintenance. Thank you for your patience.
        </p>
        <div className="loader"></div>
      </div>
    </div>
  );
}