fetch('sermons.json')
  .then(res => res.json())
  .then(sermons => {
    const mainVideo = document.getElementById('mainVideo');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const playlist = document.getElementById('playlist');

    function loadVideo(sermon) {
      mainVideo.src = sermon.url;
      videoTitle.textContent = sermon.title;
      videoDescription.textContent = sermon.description;
    }

    // Load first sermon by default
    if (sermons.length > 0) {
      loadVideo(sermons[0]);
    }

    // Build playlist
    sermons.forEach(sermon => {
      const item = document.createElement('div');
      item.className = 'playlist-item';
      item.innerHTML = `
        <img src="${sermon.thumbnail}" alt="${sermon.title}">
        <h4>${sermon.title}</h4>
      `;
      item.onclick = () => loadVideo(sermon);
      playlist.appendChild(item);
    });
  })
  .catch(err => {
    console.error('Error loading sermons:', err);
  });
