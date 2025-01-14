// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";


function App() {
  const [names, setNames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [numTeams, setNumTeams] = useState(2);
  const [playersPerTeam, setPlayersPerTeam] = useState(4);
  const [numActivities, setNumActivities] = useState(3);
  const [activities, setActivities] = useState([]);
  const [distributeAll, setDistributeAll] = useState(true);

  useEffect(() => {
    const savedNames = Cookies.get("names");
    const savedActivities = Cookies.get("activities");

    if (savedNames) {
      setNames(JSON.parse(savedNames));
    }

    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  useEffect(() => {
    Cookies.set("names", JSON.stringify(names), { expires: 7 });
  }, [names]);

  useEffect(() => {
    Cookies.set("activities", JSON.stringify(activities), { expires: 7 });
  }, [activities]);

  const handleGenerateTeams = () => {
    const validNames = names.filter((name) => name.trim() !== "");

    if (validNames.length < numTeams * playersPerTeam) {
      alert("För få spelare för att fylla alla lag med angivet antal spelare.");
      return;
    }

    const shuffled = validNames.sort(() => 0.5 - Math.random());
    const newTeams = [];

    for (let i = 0; i < numTeams; i++) {
      newTeams.push({ name: `Lag ${i + 1}`, players: [], activities: [] });
    }

    shuffled.forEach((player, index) => {
      const teamIndex = index % numTeams;
      if (newTeams[teamIndex].players.length < playersPerTeam) {
        newTeams[teamIndex].players.push(player);
      }
    });

    const activitiesToDistribute = distributeAll
      ? [...activities]
      : activities.slice(0, numTeams);

    activitiesToDistribute.forEach((activity, index) => {
      const teamIndex = index % numTeams;
      newTeams[teamIndex].activities.push(activity);
    });

    setTeams(newTeams);
  };

  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  };

  const handleAddName = () => {
    setNames([...names, ""]);
  };

  const handleRemoveName = (index) => {
    const updatedNames = [...names];
    updatedNames.splice(index, 1);
    setNames(updatedNames);
  };

  const handleActivityChange = (index, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = value;
    setActivities(updatedActivities);
  };

  const handleSetActivities = () => {
    const initialActivities = Array(numActivities).fill("");
    setActivities(initialActivities);
  };

  const handleImportNames = () => {
    const importedNames = [
      "Casper Wiss",
      "Elias Fogelström",
      "Hugo Suserud",
      "Hugo Wintfjäll",
      "Isak Reinholdsson",
      "Lukas Dahlberg",
      "Mahmoud Atrash",
      "Mio Heden",
      "Nathan Johansson",
      "Nils Dalqvist",
      "Nils Palokas Jansson",
      "Noel Sjöland",
      "Sigge Andersen",
      "Sixten Fridén",
      "Theo Bodén",
      "Theodor Lindgren",
      "Walter Ikatti",
      "Vilgot Pettersson",
      "Wilmer Krönström",
      "Zack Lycken",
      "Alfred Eriksson",
      "Alvin Elander",
      "Edin Topic",
      "Gabriel Wahlin",
      "Jesper Kelly",
      "Khaled Almousa Alahmad",
      "Leo Önnefält",
      "Noel Schwartz",
      "Olle Tillsten",
      "Wilhelm Wilhelmsson",
      "William Brinck",
      "Wilmer Åsbogård"
    ];
    setNames(importedNames);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Välkommen till Borås Bandy</h1>
      </header>
      <main className="app-main">
        <section className="team-generation">
          <h2>Slumpa Team</h2>
          <div className="input-group">
            <label>
              Antal lag:
              <input
                type="number"
                value={numTeams}
                onChange={(e) => setNumTeams(Number(e.target.value))}
                min="1"
              />
            </label>
            <label>
              Spelare per lag:
              <input
                type="number"
                value={playersPerTeam}
                onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
                min="1"
              />
            </label>
            <button onClick={handleImportNames}>Importera namn</button>
            <button onClick={handleAddName}>Lägg till spelare</button>
          </div>
          <div className="name-inputs">
            {names.map((name, index) => (
              <div key={index} className="name-row">
                <input
                  type="text"
                  value={name}
                  placeholder='Namn'
                  onChange={(e) => handleNameChange(index, e.target.value)}
                />
                <button onClick={() => handleRemoveName(index)}>Ta bort</button>
              </div>
            ))}
          </div>
          <label>
            Antal aktiviteter:
            <input
              type="number"
              value={numActivities}
              onChange={(e) => setNumActivities(Number(e.target.value))}
              min="1"
            />
          </label>
          <button onClick={handleSetActivities}>Skapa aktiviteter</button>
          <div className="activity-inputs">
            {activities.map((activity, index) => (
              <div key={index}>
                <label>Aktivitet {index + 1}:</label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => handleActivityChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={distributeAll}
              onChange={(e) => setDistributeAll(e.target.checked)}
            />
            <label>Fördela alla aktiviteter</label>
          </div>
          <button onClick={handleGenerateTeams}>Generera lag</button>
          <div className="teams">
            {teams.map((team, index) => (
              <div className="team" key={index}>
                <h3>{team.name}</h3>
                <p><strong>Aktiviteter:</strong> {team.activities.join(", ") || "Inga"}</p>
                <ul>
                  {team.players.map((player, i) => (
                    <li key={i}>{player}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="app-footer">
        <p>© 2025 Borås Bandy</p>
      </footer>
    </div>
  );
}

export default App;
