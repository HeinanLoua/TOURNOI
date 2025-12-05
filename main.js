
        // État global du tournoi
        const tournamentState = {
            players: [],
            groups: {
                A: [], B: [], C: [], D: [], E: []
            },
            qualifiers: [],
            bracket: {
                quarterFinals: [],
                semiFinals: [],
                final: []
            }
        };

        // Gestion du thème
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
                '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });

        // Animation de neige
        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄';
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
            snowflake.style.opacity = Math.random();
            snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
            
            document.body.appendChild(snowflake);

            snowflake.addEventListener('animationend', () => {
                snowflake.remove();
            });
        }

        setInterval(createSnowflake, 100);

        // Gestion des joueurs
        const playerForm = document.getElementById('playerForm');
        const playersList = document.getElementById('playersList');
        const generateGroupsBtn = document.getElementById('generateGroups');

        playerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('playerName').value;
            const bounty = document.getElementById('playerBounty').value || '0';

            if (tournamentState.players.length < 20) {
                tournamentState.players.push({ name, bounty });
                updatePlayersList();
                playerForm.reset();
            }

            generateGroupsBtn.disabled = tournamentState.players.length !== 20;
        });

        function updatePlayersList() {
            playersList.innerHTML = tournamentState.players.map((player, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${player.name}</td>
                    <td>${player.bounty}</td>
                    <td>
                        <button onclick="removePlayer(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function removePlayer(index) {
            tournamentState.players.splice(index, 1);
            updatePlayersList();
            generateGroupsBtn.disabled = tournamentState.players.length !== 20;
        }

        // Génération des poules
        generateGroupsBtn.addEventListener('click', () => {
            const shuffledPlayers = [...tournamentState.players]
                .sort(() => Math.random() - 0.5);

            Object.keys(tournamentState.groups).forEach((group, index) => {
                tournamentState.groups[group] = shuffledPlayers.slice(index * 4, (index + 1) * 4);
            });

            displayGroups();
            document.getElementById('bracketContainer').style.display = 'block';
        });

        function displayGroups() {
            const groupsContainer = document.getElementById('groupsContainer');
            groupsContainer.innerHTML = Object.entries(tournamentState.groups)
                .map(([groupName, players]) => `
                    <div class="group-card fade-in">
                        <div class="group-header">
                            <img src="data:image/svg+xml,${encodeURIComponent(`
                                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="18" fill="#2d5a9e"/>
                                    <text x="20" y="25" font-size="16" fill="white" text-anchor="middle">${groupName}</text>
                                </svg>
                            `)}" class="group-logo" alt="Group ${groupName}">
                            <h3>Groupe ${groupName}</h3>
                        </div>
                        <div class="group-players">
                            ${players.map((player, index) => `
                                <div class="player-item">
                                    ${index + 1}. ${player.name}
                                    ${player.bounty > 0 ? `(Bounty: ${player.bounty})` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('');
        }

        // Sauvegarde locale
        function saveTournamentState() {
            localStorage.setItem('tournamentState', JSON.stringify(tournamentState));
        }

        function loadTournamentState() {
            const saved = localStorage.getItem('tournamentState');
            if (saved) {
                Object.assign(tournamentState, JSON.parse(saved));
                updatePlayersList();
                if (tournamentState.players.length === 20) {
                    displayGroups();
                    document.getElementById('bracketContainer').style.display = 'block';
                }
                generateGroupsBtn.disabled = tournamentState.players.length !== 20;
            }
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', loadTournamentState);

        // Sauvegarder à chaque modification
        ['players', 'groups', 'qualifiers', 'bracket'].forEach(key => {
            Object.defineProperty(tournamentState, key, {
                set: function(value) {
                    this['_' + key] = value;
                    saveTournamentState();
                },
                get: function() {
                    return this['_' + key];
                }
            });
        });
    