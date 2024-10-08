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
    // Set canvas size (2x width, 4x height of the image)
    canvas.width = img.width * 2;
    canvas.height = img.height * 4;

    // Puzzle piece dimensions (original image dimensions)
    pieceWidth = img.width / 3;
    pieceHeight = img.height / 3;

    // Calculate the center position for the puzzle
    const centerX = (canvas.width - img.width) / 2;
    const centerY = (canvas.height - img.height) / 2;

    // Initialize pieces in the centered area
    initializePieces(centerX, centerY);
    drawPuzzle(centerX, centerY);
  };

  // Function to initialize pieces in the correct order, in the centered area
  function initializePieces(centerX, centerY) {
    pieces = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const piece = {
          x: centerX + col * pieceWidth,
          y: centerY + row * pieceHeight,
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

    // Create an array of all possible image sections (unique imgX and imgY combinations)
    const imageSections = pieces.map(piece => ({
      imgX: piece.imgX,
      imgY: piece.imgY
    }));

    // Shuffle the image sections array
    const shuffledSections = [...imageSections].sort(() => Math.random() - 0.5);

    // Assign each piece a unique shuffled image section
    pieces.forEach((piece, index) => {
      const shuffledSection = shuffledSections[index];
      piece.imgX = shuffledSection.imgX;
      piece.imgY = shuffledSection.imgY;
    });

    // Generate all possible positions based on the grid size (e.g., 3x3)
    const positions = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        positions.push({
          x: pieces[col + row * 3].x, // Keep centered positions
          y: pieces[col + row * 3].y
        });
      }
    }

    // Shuffle the positions array
    const shuffledPositions = positions.sort(() => Math.random() - 0.5);

    // Assign each piece a unique position from the shuffled positions
    pieces.forEach((piece, index) => {
      const shuffledPosition = shuffledPositions[index];
      piece.x = shuffledPosition.x;
      piece.y = shuffledPosition.y;
    });

    // Redraw the puzzle with the new shuffled pieces
    drawPuzzle();
  }

  // Draw the puzzle pieces on the canvas
  function drawPuzzle(centerX, centerY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing

    // Draw a black outline around the centered puzzle area
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeRect(centerX, centerY, img.width, img.height);

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
