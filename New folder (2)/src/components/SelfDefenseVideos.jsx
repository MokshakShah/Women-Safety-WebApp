import React from 'react';

function SelfDefenseVideos() {
  const videoLinks = [
    "https://www.youtube.com/watch?v=q1pBBRi3XF8&t=76s", // Example - Replace with real links
    "https://www.youtube.com/watch?v=KVpxP3ZZtAc&t=97s",
  ];

  return (
    <div>
      <h3>Self-Defense Video Lectures:</h3>
      <ul>
        {videoLinks.map((link, index) => (
          <li key={index}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              Video {index + 1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelfDefenseVideos;
