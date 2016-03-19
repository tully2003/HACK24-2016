<!doctype html>
<!--[if (IE 8)&!(IEMobile)]><html class="no-js is-ie8 lt-ie9 lt-ie10" lang="en"><![endif]-->
<!--[if IE 9]><html class="no-js is-ie9 lt-ie10" lang="en"><![endif]-->
<!--[if gt IE 9]><!--><html class="no-js" lang="en"><!--<![endif]-->
<head>
	<title>{% block title %}{% endblock %}</title>
	{% include "../includes/head/meta.swig" %}
	{% include "../includes/head/css.swig" %}
	{% include "../includes/head/icons.swig" %}
	{% include "../includes/head/js.swig" %}

	{% block headcontent %}{% endblock %}

</head>

<body>

	{% include "../includes/structure/site-header.swig" %}

	<div class="site-wrapper">

	<!-- Begin Content Block -->
	{% block content %}{% endblock %}
	<!-- End Content Block -->


	<!-- Begin Footer Block -->
	{% block footcontent %}{% endblock %}
	<!-- End Footer Block -->
	{% include "../includes/structure/footer.swig" %}
	{% include "../includes/foot/js.swig" %}

	</div>
</body>
</html>
