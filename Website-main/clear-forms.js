window.addEventListener('pageshow', function (event) {
  // Reset all forms and clear inputs/textareas to avoid autofill on refresh/back
  document.querySelectorAll('form').forEach(function (f) { f.reset(); });
  document.querySelectorAll('input, textarea').forEach(function (el) {
    // don't clear hidden inputs
    if (el.type && el.type.toLowerCase() === 'hidden') return;
    try { el.value = ''; } catch (e) {}
    el.setAttribute('autocomplete', 'off');
  });
});
