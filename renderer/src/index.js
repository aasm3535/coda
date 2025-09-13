const dragHandle = document.getElementById('drag-handle');

if (dragHandle) {
  dragHandle.addEventListener('mousedown', () => {
    document.body.classList.add('dragging');
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('dragging');
  });
}