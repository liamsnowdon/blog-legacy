const categoryTemplate = `{% extends "base.njk" %}

{% block metaTitle %}<% CATEGORY_NAME %> Posts | Liam Snowdon's Blog{% endblock %}
{% block metaDescription %}<% CATEGORY_INTRO %>{% endblock %}

{% block metaOgTitle %}<% CATEGORY_NAME %> Posts | Liam Snowdon's Blog{% endblock %}
{% block metaOgDescription %}<% CATEGORY_INTRO %>{% endblock %}
{% block metaOgImage %}<% CATEGORY_IMAGE_URL %>{% endblock %}
{% block metaOgUrl %}/categories/<% CATEGORY_FILE %>{% endblock %}

{% block content %}
  {% import 'macros/post-pods.njk' as pods %}

  {% set posts = data.posts | categoryPosts(<% CATEGORY_ID %>) | sort(true, true, 'datePosted') %}

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
        <nav class="c-breadcrumbs">
          <ul class="c-breadcrumbs__links">
            <li class="c-breadcrumbs__link">
              <a href="/">Home</a>
            </li>

            <li class="c-breadcrumbs__link">
              <a href="/categories.html">Categories</a>
            </li>

            <li class="c-breadcrumbs__link c-breadcrumbs__link--active-page">
              <% CATEGORY_NAME %>
            </li>
          </ul>
        </nav>

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

export default categoryTemplate;