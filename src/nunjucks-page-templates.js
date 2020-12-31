export const tagTemplate = `{% extends "base.njk" %}

{% block metaTitle %}<% TAG_NAME %> Posts | Liam Snowdon's Blog{% endblock %}
{% block metaDescription %}<% TAG_INTRO %>{% endblock %}

{% block metaOgTitle %}<% TAG_NAME %> Posts | Liam Snowdon's Blog{% endblock %}
{% block metaOgDescription %}<% TAG_INTRO %>{% endblock %}
{% block metaOgImage %}<% TAG_IMAGE_URL %>{% endblock %}
{% block metaOgUrl %}/tags/<% TAG_FILE %>{% endblock %}

{% import 'macros/tags-page.njk' as tagsPage %}

{% set tag = data.tags | getById(<% TAG_ID %>) %}

{% block content %}
  {{ tagsPage.header(tag) }}

  <main>
    {% include "partials/sticky-navigation.njk" %}

    {{ tagsPage.content(tag) }}
  </main>
{% endblock %}
`;

export const categoryTemplate = `{% extends "base.njk" %}

{% block metaTitle %}<% CATEGORY_NAME %> Posts | Liam Snowdon's Blog{% endblock %}
{% block metaDescription %}<% CATEGORY_INTRO %>{% endblock %}

{% block metaOgTitle %}<% CATEGORY_NAME %> Posts | Liam Snowdon's Blog{% endblock %}
{% block metaOgDescription %}<% CATEGORY_INTRO %>{% endblock %}
{% block metaOgImage %}<% CATEGORY_IMAGE_URL %>{% endblock %}
{% block metaOgUrl %}/categories/<% CATEGORY_FILE %>{% endblock %}

{% block content %}
  {% import 'macros/post-pods.njk' as pods %}

  {% set posts = data.posts | categoryPosts(<% CATEGORY_ID %>) %}

  <header class="l-header">
    <div class="l-header__content">
      <h1 class="l-header__heading load-hidden js-hero-text"><% CATEGORY_NAME %> Posts</h1>
      <p class="load-hidden js-hero-text"><% CATEGORY_INTRO %></p>
    </div>
  </header>

  <main>
    {% include "partials/sticky-navigation.njk" %}

    <div class="l-wrapper">
      <div class="l-content">
        {% if posts | length > 0 %}
          <div class="l-grid">
            <div class="l-grid__row l-grid__row--column-margins">
              {% for post in posts %}
                <div class="l-grid__column l-grid__column--12 l-grid__column--medium-6 l-grid__column--large-3">
                  {{ pods.postPod(post) }}
                </div>
              {% endfor %}
            </div>
          </div>
        {% else %}
          <div class="l-content__title">
            <p>There are no <% CATEGORY_NAME %> posts yet. Come back later!</p>
          </div>
        {% endif %}
      </div>
    </div>
  </main>
{% endblock %}
`;

export const postTemplate = `{% extends "base.njk" %}

{% block metaTitle %}<% POST_TITLE %> | Liam Snowdon's Blog{% endblock %}
{% block metaDescription %}<% POST_INTRO %>{% endblock %}

{% block metaOgTitle %}<% POST_TITLE %> | Liam Snowdon's Blog{% endblock %}
{% block metaOgDescription %}<% POST_INTRO %>{% endblock %}
{% block metaOgType %}article{% endblock %}

{% block metaArticle %}
  <meta property="article:published_time" content="<% POST_DATE_POSTED %>">
  <meta property="article:author" content="<% POST_AUTHOR %>">
  <% ARTICLE_TAGS %>
{% endblock %}

{% block metaOgImage %}<% POST_OG_IMAGE_URL %>{% endblock %}
{% block metaOgUrl %}/posts/<% POST_FILE %>{% endblock %}

{% import "macros/post-page.njk" as postPage %}

{% set post = data.posts | getById(<% POST_ID %>) %}

{% block content %}
  {{ postPage.header(post) }}
  
  <main>
    {% include "partials/sticky-navigation.njk" %}

    {{ postPage.content(post) }}
  </main>
{% endblock %}

{% block additionalJS %}
  <script src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed/public/caniuse-embed.min.js"></script>
{% endblock %}
`;
