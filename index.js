const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const KEY_VALUE = 'AIzaSyA97KA_0l-D41WEPY3-SMsPi_qa9gchCa0';
const page = {
  nextPageToken: null,
  searchTerm: null,
}

function getDataFromApi(searchTerm, callback) {
  const settings = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part: 'snippet',
      key: KEY_VALUE,
      q: `${searchTerm}`,
      type: 'video',
      pageToken: page.nextPageToken,
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);
}

function renderResult(result) {
  return `
    <div class="js-result-name">
      <a href="https://www.youtube.com/watch?v=${result.id.videoId}" data-lity>
      <img src="${result.snippet.thumbnails.medium.url}" class="thumbnail-yt" alt="">${result.snippet.title}</a>
      <p class="channel-source">More From <a class="js-user-name" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.channelTitle}</a></p>
      <hr>
    </div>
  `;
}

function showSearchTerm(query) {
  return `
  <div class="js-search-display" aria-live="assertive">
  <p class="channel-source">You searched for "${page.searchTerm}"</p>
  </div>
  `;
}

function displaySearchData(data) {
  page.nextPageToken = data.nextPageToken;
  const results = data.items.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
  //Conditional (ternary) Operator - shorthand for if/else
  results.length ? $('.result-header').removeClass('hidden') : $('.result-header').addClass('hidden');
  results.length ? $('.js-more-vids').removeClass('hidden') : $('.js-more-vids').addClass('hidden');
}

function moreVids() {
  $('.js-more-vids').on('click', event => {
    event.preventDefault();
    getDataFromApi(page.searchTerm, displaySearchData);
  })
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    page.searchTerm = query;
    queryTarget.val("");
    $('.js-search-display').html(showSearchTerm);
    getDataFromApi(query, displaySearchData);
  });
}

$(watchSubmit);
$(moreVids);
