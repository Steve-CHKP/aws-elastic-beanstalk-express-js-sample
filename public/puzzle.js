window.onload = function() {
  const canvas = document.getElementById('puzzleCanvas');
  const ctx = canvas.getContext('2d');
  const shuffleButton = document.getElementById('shuffleButton');
  let pieces = [];
  let pieceWidth, pieceHeight;
  let draggingPiece = null;
  let offsetX, offsetY;

  // Load the Checkpoint logo
  const img = new Image();
  img.src = './images/CP-blog-banner.png'; // Path to the image
  img.onload = function() {
    // Set canvas size to match the image size dynamically
    canvas.width = img.width;
    canvas.height = img.height;

    pieceWidth = canvas.width / 3;  // Assuming a 3x3 grid puzzle
    pieceHeight = canvas.height / 3;

    // Initialize pieces
    initializePieces();
    drawPuzzle();
  };

  // Function to initialize pieces in the correct order
  function initializePieces() {
    pieces = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const piece = {
          x: col * pieceWidth,
          y: row * pieceHeight,
          imgX: col * pieceWidth,
          imgY: row * pieceHeight
        };
        pieces.push(piece);
      }
    }
  }

  // Function to shuffle the puzzle pieces randomly
  function shufflePieces() {
    console.log("Shuffling pieces...");

    // First, shuffle the pieces array
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);

    // Now, reassign the image position (imgX and imgY) of each piece based on the shuffled array
    pieces.forEach((piece, index) => {
      piece.imgX = shuffledPieces[index].imgX;
      piece.imgY = shuffledPieces[index].imgY;
    });

    // Redraw the puzzle with the new shuffled pieces
    drawPuzzle();
  }

  // Draw the puzzle pieces on the canvas
  function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
    pieces.forEach(piece => {
      // Draw the image piece
      ctx.drawImage(img, piece.imgX, piece.imgY, pieceWidth, pieceHeight, piece.x, piece.y, pieceWidth, pieceHeight);

      // Draw a black outline around the piece
      ctx.strokeStyle = 'black';   // Set stroke color to black
      ctx.lineWidth = 2;           // Set the width of the outline
      ctx.strokeRect(piece.x, piece.y, pieceWidth, pieceHeight); // Draw the outline
    });
  }

  // Add event listener for the shuffle button
  shuffleButton.addEventListener('click', function() {
    shufflePieces(); // Call the shuffle function
  });

  // Enable drag and drop functionality
  canvas.addEventListener('mousedown', startDragging);
  canvas.addEventListener('mousemove', dragPiece);
  canvas.addEventListener('mouseup', dropPiece);

  function startDragging(e) {
    const mousePos = getMousePos(canvas, e);
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (isInside(mousePos, piece)) {
        draggingPiece = piece;
        offsetX = mousePos.x - piece.x;
        offsetY = mousePos.y - piece.y;
        break;
      }
    }
  }

  function dragPiece(e) {
    if (!draggingPiece) return;
    const mousePos = getMousePos(canvas, e);
    draggingPiece.x = mousePos.x - offsetX;
    draggingPiece.y = mousePos.y - offsetY;
    drawPuzzle();
  }

  function dropPiece() {
    draggingPiece = null;
  }

  // Utility functions
  function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function isInside(mousePos, piece) {
    return mousePos.x > piece.x && mousePos.x < piece.x + pieceWidth &&
           mousePos.y > piece.y && mousePos.y < piece.y + pieceHeight;
  }
};
