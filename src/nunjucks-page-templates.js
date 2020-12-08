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

  <header class="l-header">
    <div class="l-header__content">
      <h1 class="l-header__heading"><% CATEGORY_NAME %> Posts</h1>
      <p><% CATEGORY_INTRO %></p>
    </div>
  </header>

  <main>
    {% include "partials/sticky-navigation.njk" %}

    <div class="l-wrapper">
      <div class="l-content">
        <div class="l-grid">
          <div class="l-grid__row l-grid__row--column-margins">
            {% for post in data.posts %}
              {% if post.category === <% CATEGORY_ID %> %}
                <div class="l-grid__column l-grid__column--12 l-grid__column--medium-6 l-grid__column--large-3">
                  {{ pods.postPod(post) }}
                </div>
              {% endif %}
            {% endfor %}
          </div>
        </div>
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

{% block metaOgImage %}<% POST_IMAGE_URL %>{% endblock %}
{% block metaOgUrl %}/categories/<% POST_FILE %>{% endblock %}

{% import "macros/post-page.njk" as postPage %}

{% set post = data.posts | getById(<% POST_ID %>) %}

{% block content %}
  {{ postPage.header(post) }}
  
  <main>
    {% include "partials/sticky-navigation.njk" %}

    {{ postPage.content(post) }}
  </main>
{% endblock %}
`;
