class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;

    this.x = 0;
    this.y = 0;

    // SVG refs
    this.circle = null;
    this.text = null;
  }
}

let root = null;
const svg = document.getElementById("treeCanvas");
const msg = document.getElementById("message");

/* ---------- AVL LOGIC ---------- */

const h = n => n ? n.height : 0;
const balance = n => n ? h(n.left) - h(n.right) : 0;

function rightRotate(y) {
  msg.innerText = "🔄 LL Rotation (Right Rotate)";
  highlight(y);

  let x = y.left;
  let t2 = x.right;

  x.right = y;
  y.left = t2;

  y.height = Math.max(h(y.left), h(y.right)) + 1;
  x.height = Math.max(h(x.left), h(x.right)) + 1;

  return x;
}

function leftRotate(x) {
  msg.innerText = "🔄 RR Rotation (Left Rotate)";
  highlight(x);

  let y = x.right;
  let t2 = y.left;

  y.left = x;
  x.right = t2;

  x.height = Math.max(h(x.left), h(x.right)) + 1;
  y.height = Math.max(h(y.left), h(y.right)) + 1;

  return y;
}

function insert(node, val) {
  if (!node) return new Node(val);

  if (val < node.value)
    node.left = insert(node.left, val);
  else if (val > node.value)
    node.right = insert(node.right, val);
  else return node;

  node.height = 1 + Math.max(h(node.left), h(node.right));
  let bf = balance(node);

  if (bf > 1 && val < node.left.value) return rightRotate(node);
  if (bf < -1 && val > node.right.value) return leftRotate(node);

  if (bf > 1 && val > node.left.value) {
    msg.innerText = "🔄 LR Rotation";
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }

  if (bf < -1 && val < node.right.value) {
    msg.innerText = "🔄 RL Rotation";
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }

  return node;
}

/* ---------- UI ---------- */

function insertValue() {
  const v = +document.getElementById("valueInput").value;
  if (isNaN(v)) return;
  root = insert(root, v);
  layout();
}

/* ---------- GRAPHICAL LAYOUT ---------- */

function layout() {
  assign(root, 450, 50, 220);
  draw(root);
}

function assign(n, x, y, gap) {
  if (!n) return;
  n.x = x;
  n.y = y;
  assign(n.left, x - gap, y + 90, gap / 1.7);
  assign(n.right, x + gap, y + 90, gap / 1.7);
}

/* ---------- SVG DRAWING ---------- */

function draw(node) {
  if (!node) return;

  if (!node.circle) createNode(node);

  moveNode(node);
  draw(node.left);
  draw(node.right);
  drawEdge(node, node.left);
  drawEdge(node, node.right);
}

function createNode(n) {
  n.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  n.circle.setAttribute("r", 20);
  n.circle.setAttribute("class", "node");

  n.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  n.text.setAttribute("class", "node-text");

  svg.appendChild(n.circle);
  svg.appendChild(n.text);
}

function moveNode(n) {
  n.circle.setAttribute("cx", n.x);
  n.circle.setAttribute("cy", n.y);

  n.text.setAttribute("x", n.x);
  n.text.setAttribute("y", n.y);
  n.text.textContent = n.value;
}

function drawEdge(p, c) {
  if (!c) return;

  if (!c.line) {
    c.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    c.line.setAttribute("stroke", "#aaa");
    svg.insertBefore(c.line, svg.firstChild);
  }

  c.line.setAttribute("x1", p.x);
  c.line.setAttribute("y1", p.y);
  c.line.setAttribute("x2", c.x);
  c.line.setAttribute("y2", c.y);
}

/* ---------- EFFECTS ---------- */

function highlight(node) {
  if (!node || !node.circle) return;
  node.circle.classList.add("rotating");
  setTimeout(() => node.circle.classList.remove("rotating"), 700);
}
