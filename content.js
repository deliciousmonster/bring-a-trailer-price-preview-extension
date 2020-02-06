const getDetailPage = async (link) => {
  const thisLink = link.getAttribute('href');
  const response = await fetch(thisLink);
  const string = await response.text();
  const domparser = new DOMParser();
  const htmlContent = domparser.parseFromString(string, 'text/html');
  const priceContent = htmlContent.getElementsByClassName('listing-available-info');

  let label = false;
  let price = false;

  if (priceContent.length) {
    const labelTags = priceContent[0].getElementsByClassName('data-label');
    if (labelTags.length) {
      label = labelTags[0].innerText;
    }

    const valueTags = priceContent[0].getElementsByClassName('data-value');
    if (valueTags.length) {
      price = valueTags[0].innerText;
    }
  }
  return { price, label };
};

const readListings = async (listingClass, linkClass, imageClass) => {
  const listings = document.getElementsByClassName(listingClass);
  for (let i = 0; i < listings.length; i++) {
    const thisListing = listings[i];
    const listingTitle = thisListing.getElementsByClassName(linkClass);
    const thisTitle = listingTitle[0];
    const { price, label } = await getDetailPage(thisTitle);

    if (price && label) {
      const listingImageLink = thisListing.getElementsByClassName(imageClass);
      const thisImageLink = listingImageLink[0];
      thisImageLink.style.cssText = 'display: block; position:relative;';

      const priceHolder = document.createElement('div');
      const priceText = document.createTextNode(`${label === 'Ends In:' || label === 'Current Bid:' || listingClass === 'current-auction' ? '' : label} ${price}`);
      priceHolder.appendChild(priceText);
      priceHolder.style.cssText = `display: block; font-size: ${listingClass === 'current-auction' ? '11px' : ''}; font-weight: bold; color: #ffffff; position: absolute; top: 0; left: 0; padding: ${listingClass === 'current-auction' ? '0 8px' : '5px 15px'}; border-radius: 0 0 5px 0; background: rgba(0,0,0,0.75)`;
      thisImageLink.appendChild(priceHolder);
    }
  }
};

readListings('has-post-thumbnail', 'post-title-link', 'post-image-link');
readListings('bat-item', 'bat-item-link', 'bat-item-image-link');
readListings('current-auction', 'current-auction-link', 'current-auction-link');




