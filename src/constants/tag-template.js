const tagTemplate = `{% extends "base.njk" %}

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

export default tagTemplate;