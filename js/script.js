const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector("#template-tag-link").innerHTML),
  authorLink: Handlebars.compile(document.querySelector("#template-author-link").innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector("#template-tag-cloud-link").innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector("#template-author-cloud-link").innerHTML),
}

'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optAuthorsListSelector = '.authors-list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';


function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');


  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);

  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const selectedArticle = clickedElement.getAttribute('href');
  // console.log(selectedArticle);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(selectedArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


// exercise 5.4

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  // console.log(articles);
  let html = '';

  /* for each article */
  for (let article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
    // console.log(linkHTML);

    /* insert link into titleList */
    html = html + linkHTML;
    // console.log(html);
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}


function calculateTagsParams(tags) {
  params = {
    min: 9999,
    max: 0,
  };

  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } else if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1)

  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const wrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {

      /* generate HTML of the link */
      const linkHTMLData = { tag: tag };
      const linkHTML = templates.tagLink(linkHTMLData);

      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    wrapper.innerHTML = html;
  }
  /* END LOOP: for every article: */

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams: ', tagsParams);
  /*[NEW] create variable for all links HTML code */
  const allTagsData = { tags: [] };

  /*[NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /*[NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }

  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}


generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let activeLink of activeLinks) {

    /* remove class active */
    activeLink.classList.remove('active');

    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagsLinks = document.querySelector('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let tagLink of tagsLinks) {

    /* add class active */
    tagLink.classList.add('active');

    /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tags = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let tag of tags) {

    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */
  }
}

addClickListenersToTags();


function generateAuthors() {

  let allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find authors wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    // console.log(authorWrapper);

    /* make html variable with empty string */
    let html = '';

    /* get authors from data-author attribute */
    const articlesAuthor = article.getAttribute('data-author');

    /* generate HTML of the link */
    const linkHTMLData = {
      id: "author-" + articlesAuthor,
      title: articlesAuthor,
    };
    const linkHTML = templates.articleLink(linkHTMLData);
    // console.log(linkHTML);

    /* add generated code to html variable */
    html = html + linkHTML;
    // console.log(html);

    if (!allAuthors.hasOwnProperty(articlesAuthor)) {
      allAuthors[articlesAuthor] = 1;
    } else {
      allAuthors[articlesAuthor]++;
    }

    /* insert HTML of all the links into the tags wrapper */
    authorWrapper.innerHTML = html;

    /* END LOOP: for every article: */
  }
  const tagList = document.querySelector(optAuthorsListSelector);
  const allAuthorsData = { authors: [] };
  for (let author in allAuthors) {
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
    console.log('allAuthors: ', allAuthorsData);
  }
  tagList.innerHTML = templates.authorCloudLink(allAuthorsData);

}

generateAuthors();


// exercise 6.2

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');

  /* find all authors links with class active */
  const activeAuthorsLinks = document.querySelectorAll('a [href="' + href + '"]');

  /* START LOOP: for each active author link */
  for (let activeAuthor of activeAuthorsLinks) {

    /* remove class active */
    activeAuthor.classList.remove('active');

    /* END LOOP: for each active author link */
  }

  /* find all authors links with "href" attribute equal to the "href" constant */
  const authorsLinks = document.querySelector('a[href="' + href + '"]');

  /* START LOOP: for each found author link */
  for (let authorLink of authorsLinks) {

    /* add class active */
    authorLink.classList.add('active');

    /* END LOOP: for each found authors link */
  }

  /* execute function "generateAuthors" with article selector as argument */
  generateAuthors('[data-author="' + author + '"]');

}

function addClickListenersToAuthors() {

  /* find all links to tags */
  const authorsLinks = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  for (let authorsLink of authorsLinks) {

    /* add tagClickHandler as event listener for that link */
    authorsLink.addEventListener('click', authorClickHandler);

    /* END LOOP: for each link */
  }

}

addClickListenersToAuthors();
