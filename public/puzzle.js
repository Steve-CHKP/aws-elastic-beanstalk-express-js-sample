window.onload = function() {
  const canvas = document.getElementById('puzzleCanvas');
  const ctx = canvas.getContext('2d');

  // Load the Checkpoint logo
  const img = new Image();
  img.src = './images/CP-blog-banner.png';
  img.onload = function() {
    const pieceWidth = canvas.width / 3;
    const pieceHeight = canvas.height / 3;
    
    // Draw the image as pieces
    const pieces = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const piece = {
          x: col * pieceWidth,
          y: row * pieceHeight,
          imgX: col * pieceWidth,
          imgY: row * pieceHeight
        };
        pieces.push(piece);
        ctx.drawImage(img, piece.imgX, piece.imgY, pieceWidth, pieceHeight, piece.x, piece.y, pieceWidth, pieceHeight);
      }
    }
    
    // You can now implement shuffle, drag and drop functionality
    // Further code for dragging pieces, checking if the puzzle is solved will be added here.
  };
};
