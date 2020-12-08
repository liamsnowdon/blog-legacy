const tag = `{% extends "base.njk" %}

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

const category = `{% extends "base.njk" %}

{% block content %}
  {% import 'macros/post-pods.njk' as pods %}

  <header class="l-header">
    <div class="l-header__content">
      <h1 class="l-header__heading"><% CATEGORY_NAME %> Posts</h1>
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

const post = `{% extends "base.njk" %}

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

exports.tag = tag;
exports.category = category;
exports.post = post;