document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for nav
  document.querySelectorAll('.nav a').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(el.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Set today’s date
  const today = new Date().toISOString().split('T')[0];
  const dateSpan = document.getElementById('today');
  if (dateSpan) dateSpan.textContent = today;

  // === Live Matches from API-Football ===
  fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
    headers: {
      'x-apisports-key': 'ae7d4e153f29e96d0bb7f5e498fb8f25'
    }
  })
    .then(res => res.json())
    .then(data => {
      const matchCards = document.getElementById('matchCards');
      if (!matchCards) return;
      matchCards.innerHTML = '';

      if (data.response.length === 0) {
        matchCards.innerHTML = '<p>No matches today.</p>';
        return;
      }

      data.response.forEach(match => {
        const home = match.teams.home.name;
        const away = match.teams.away.name;
        const scoreHome = match.goals.home ?? '-';
        const scoreAway = match.goals.away ?? '-';
        const league = match.league.name;
        const status = match.fixture.status.short;
        const homeLogo = match.teams.home.logo;
        const awayLogo = match.teams.away.logo;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <img src="${homeLogo}" alt="${home}" width="26" height="26" onerror="this.src='default-team.png'">
              <strong>${home}</strong>
            </div>
            <div style="font-weight: bold; font-size: 16px;">${scoreHome}‑${scoreAway}</div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <strong>${away}</strong>
              <img src="${awayLogo}" alt="${away}" width="26" height="26" onerror="this.src='default-team.png'">
            </div>
          </div>
          <p style="margin-top: 10px;">${league} • ${status}</p>
        `;
        matchCards.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Match fetch error:', err);
      const matchCards = document.getElementById('matchCards');
      if (matchCards) matchCards.innerHTML = '<p>Failed to load matches.</p>';
    });

  // === Football News from Newsdata.io ===
  fetch('https://newsdata.io/api/1/news?apikey=pub_2f516cb114fe47a6b669bf32a97a90a6&q=football&language=en')
    .then(res => res.json())
    .then(data => {
      const newsCards = document.getElementById('newsCards');
      if (!newsCards) return;
      newsCards.innerHTML = '';

      if (!data.results || data.results.length === 0) {
        newsCards.innerHTML = '<p>No football news found.</p>';
        return;
      }

      data.results.slice(0, 6).forEach(article => {
        const title = article.title;
        const source = article.source_id || 'Unknown Source';
        const date = new Date(article.pubDate).toLocaleDateString();
        const link = article.link;

        const card = document.createElement('a');
        card.className = 'card';
        card.href = link;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.style.display = 'block';
        card.style.textDecoration = 'none';
        card.style.color = 'inherit';

        card.innerHTML = `
          <h3>${title}</h3>
          <p>${source} • ${date}</p>
        `;

        newsCards.appendChild(card);
      });
    })
    .catch(err => {
      console.error('News fetch error:', err);
      const newsCards = document.getElementById('newsCards');
      if (newsCards) newsCards.innerHTML = '<p>Failed to load news.</p>';
    });
});
