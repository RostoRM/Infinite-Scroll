const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

// Unsplash API
let initialCount = 5;
const apiKey = '-9x0mNtV4XsNuWksfcq3IH7lBfwD2jOQQXVRgQ9bGuE';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

//Update Api URL With new Count
const updateUrl = (picCount) => {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
};

// Check if all images were loaded
const imageLoaded = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
};

//Helper Function to Set Attributes on DOM Eelements
const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

// Create Elements for Links & Photos ,add to DOM
const displayPhotos = () => {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  //Run function for each object in photoArray
  photosArray.forEach((photo) => {
    // Create <a> to link to full photo
    const aElement = document.createElement('a');
    setAttributes(aElement, { href: photo.links.html, target: '_blank' });
    //Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    //Event Listener, Check when each is finished loading
    img.addEventListener('load', imageLoaded);
    //Put <img> inside <a>, then both inside imageContainer Element
    aElement.appendChild(img);
    imageContainer.appendChild(aElement);
  });
};

// Get photos from Unsplash API
const getPhotos = async () => {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      updateUrl(30);
      isInitialLoad = false;
    }
  } catch (error) {
    //Catch Error Here
    console.log(`Sorry,Unsplash API isn't responding`, error);
  }
};

//Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

//On Load
getPhotos();
