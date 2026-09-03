/**
 * This helper script adds social share buttons to each event
 * in a live feed (if such a feed is present on the page).
 * The social share buttons are generated via a template
 * retrieved from the back end using an AJAX request.
 */

document.addEventListener('DOMContentLoaded', async (e) => {
  const liveEvents = document.querySelectorAll('.liveDayContainer .contentColumn .postContainer');
  if (!liveEvents.length) return;
  const mainPostId = Array
    .from(document.querySelector('body').classList)
    .reduce((acc, currentClass) => {
      if (currentClass.includes('postid-')) {
        return Number.parseInt(currentClass.replace('postid-', ''));
      };
      return acc;
    }, 0);
  if (!mainPostId) return;
  const template = await getLiveFeedSocialTemplate(mainPostId);
  liveEvents.forEach((liveEvent) => {
    const socialDiv = liveEvent.querySelector('.singleSocialShares');
    const titleEl = liveEvent.querySelector('.singleHedLiveFeed');
    const title = titleEl ? titleEl.innerText : '';
    const eventId = liveEvent.id;
    if (title && eventId && socialDiv) {
      const socials = template
        .replaceAll('{event_id}', eventId)
        .replaceAll('{title}', title);
      socialDiv.innerHTML = socials;
    }
  });
});

async function getLiveFeedSocialTemplate(mainPostId) {
  try {
    const formData = new FormData();
    formData.append( 'action', 'livefeed_social_template' );
    formData.append( 'livefeed_nonce', LIVE_FEED.nonce);
    formData.append( 'main_post_id', mainPostId);
    const response = await fetch(LIVE_FEED.ajaxUrl, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Could not retrieve social share button template: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(error.message);
  }
}
