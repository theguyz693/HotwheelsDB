const carForm = document.getElementById('carForm');
const collectionDiv = document.getElementById('collection');
const errorDiv = document.getElementById('error');
const submitBtn = document.getElementById('submitBtn');

let collection = JSON.parse(localStorage.getItem('hwCollection')) || [];
let editIndex = -1;

function renderCollection() {
  collectionDiv.innerHTML = '';

  if (collection.length === 0) {
    collectionDiv.innerHTML = '<p>No cars in your collection yet.</p>';
    return;
  }

  collection.forEach((car, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = car.image;
    img.alt = car.name;

    const content = document.createElement('div');
    content.className = 'card-content';

    const title = document.createElement('h3');
    title.textContent = car.name;

    const value = document.createElement('p');
    value.textContent = `₹${car.value}`;

    content.appendChild(title);
    content.appendChild(value);

    if (car.wiki) {
      const wikiLink = document.createElement('a');
      wikiLink.href = car.wiki;
      wikiLink.target = '_blank';
      wikiLink.textContent = 'Wiki Info';
      content.appendChild(wikiLink);
    }

    if (car.marketplace) {
      const marketLink = document.createElement('a');
      marketLink.href = car.marketplace;
      marketLink.target = '_blank';
      marketLink.textContent = 'Buy Online';
      content.appendChild(marketLink);
    }

    const btnContainer = document.createElement('div');
    btnContainer.className = 'card-buttons';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'edit';
    btnEdit.textContent = 'Edit';
    btnEdit.onclick = () => startEdit(index);

    const btnDelete = document.createElement('button');
    btnDelete.className = 'delete';
    btnDelete.textContent = 'Delete';
    btnDelete.onclick = () => deleteCar(index);

    const btnInfo = document.createElement('button');
    btnInfo.className = 'info';
    btnInfo.textContent = 'Info';
    btnInfo.onclick = () => {
      const link = car.wiki || car.marketplace;
      if (link) {
        window.open(link, '_blank');
      } else {
        alert(`No external link available for ${car.name}.`);
      }
    };

    btnContainer.appendChild(btnEdit);
    btnContainer.appendChild(btnDelete);
    btnContainer.appendChild(btnInfo);

    card.appendChild(img);
    card.appendChild(content);
    card.appendChild(btnContainer);

    collectionDiv.appendChild(card);
  });
}

carForm.addEventListener('submit', e => {
  e.preventDefault();
  errorDiv.textContent = '';

  const name = carForm.name.value.trim();
  const value = parseInt(carForm.value.value.trim());
  const image = carForm.image.value.trim();
  const wiki = carForm.wiki.value.trim();
  const marketplace = carForm.marketplace.value.trim();

  if (!name || !image || isNaN(value) || value < 0) {
    errorDiv.textContent = 'Please provide valid car name, image URL, and a non-negative value.';
    return;
  }

  const carObj = { name, value, image, wiki, marketplace };

  if (editIndex === -1) {
    collection.push(carObj);
  } else {
    collection[editIndex] = carObj;
    editIndex = -1;
    submitBtn.textContent = 'Add to Collection';
  }

  localStorage.setItem('hwCollection', JSON.stringify(collection));
  carForm.reset();
  renderCollection();
});

function startEdit(index) {
  const car = collection[index];
  carForm.name.value = car.name;
  carForm.value.value = car.value;
  carForm.image.value = car.image;
  carForm.wiki.value = car.wiki;
  carForm.marketplace.value = car.marketplace;

  editIndex = index;
  submitBtn.textContent = 'Update Car';
}

function deleteCar(index) {
  if (confirm('Are you sure you want to delete this car?')) {
    collection.splice(index, 1);
    localStorage.setItem('hwCollection', JSON.stringify(collection));
    if (editIndex === index) {
      carForm.reset();
      editIndex = -1;
      submitBtn.textContent = 'Add to Collection';
    }
    renderCollection();
  }
}

// Dark mode toggle
document.getElementById('toggleMode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const current = document.body.classList.contains('dark');
  localStorage.setItem('hwDarkMode', current ? 'enabled' : 'disabled');
});

if (localStorage.getItem('hwDarkMode') === 'enabled') {
  document.body.classList.add('dark');
}

renderCollection();
