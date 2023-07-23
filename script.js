const pattern = document.querySelector('#frame__container');
let pattern_size = {width: 6, height: 6}
let use_symetry = false;
let pattern_elements_weight_list = [
  { element: '<use href="pattern_shapes_sprite.svg#svg-1"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-2"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-3"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-4"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-5"></use>', weight: 1, symmetry_of: '<use href="pattern_shapes_sprite.svg#svg-6"></use>' },
  { element: '<use href="pattern_shapes_sprite.svg#svg-6"></use>', weight: 1,  symmetry_of: '<use href="pattern_shapes_sprite.svg#svg-5"></use>' },
  { element: '<use href="pattern_shapes_sprite.svg#svg-7"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-8"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-9"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-10"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-11"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-12"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-13"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-14"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-15"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-16"></use>', weight: 1 },
  { element: '<use href="pattern_shapes_sprite.svg#svg-17"></use>', weight: 1, symmetry_of: '<use href="pattern_shapes_sprite.svg#svg-18"></use>' },
  { element: '<use href="pattern_shapes_sprite.svg#svg-18"></use>', weight: 1, symmetry_of: '<use href="pattern_shapes_sprite.svg#svg-17"></use>' },
  { element: '', weight: 5 },
]

function generatePattern(symetry = false) {
  pattern.innerHTML = '';
  let random_number_list = [];
  let weighted_element_list = [];
  for (let i = 0; i < pattern_elements_weight_list.length; i++) {
    for (let j = 0; j < pattern_elements_weight_list[i].weight; j++) {
      weighted_element_list.push(pattern_elements_weight_list[i]);
    }
  }
  if (symetry) {
    if (pattern_size.width % 2 != 0) {
      pattern_size.width++;
    }
    for (let i = 0; i < pattern_size.height; i++) {
      let random_number_list_row = [];
      for (let j = 0; j < pattern_size.width / 2; j++) {
        random_number_list_row.push(weighted_element_list[Math.floor(Math.random() * weighted_element_list.length)].element);
      }
      for (let j = pattern_size.width / 2 - 1; j >= 0; j--) {
        random_number_list_row.push(random_number_list_row[j]);
        for (let k = 0; k < weighted_element_list.length; k++) {
          if (weighted_element_list[k].element == random_number_list_row[j]) {
            if (weighted_element_list[k].symmetry_of) {
              random_number_list_row[random_number_list_row.length-1] = weighted_element_list[k].symmetry_of;
            }
          }
        }
      }
      random_number_list = random_number_list.concat(random_number_list_row);
    }
  }
  else {
    for (let i = 0; i < pattern_size.height; i++) {
      for (let j = 0; j < pattern_size.width; j++) {
        random_number_list.push(weighted_element_list[Math.floor(Math.random() * weighted_element_list.length)].element);
      }
    }
  }
  pattern.style.gridTemplateColumns = 'repeat(' + pattern_size.width + ', 1fr)';
  pattern.style.gridTemplateRows = 'repeat(' + pattern_size.height + ', 1fr)';
  for (random_number of random_number_list) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '25');
    svg.setAttribute('height', '25');
    svg.innerHTML = random_number;
    pattern.appendChild(svg);
  }
}

generatePattern();

function patternColorSelector(element, variable) {
  const element_color = document.getElementById(element);
  element_color.value = getComputedStyle(document.documentElement).getPropertyValue(variable);
  element_color.addEventListener('input', function() {
    let new_color = element_color.value;
    document.documentElement.style.setProperty(variable, new_color);
  });
}

patternColorSelector('pattern-bg', '--pattern-background-color');
patternColorSelector('pattern-color', '--pattern-color');


const dimensions = ['width', 'height']
for (direction of dimensions) {
  const element_size = document.getElementById('pattern-size-' + direction);
  const element_size_display = document.getElementById('pattern-size-' + direction + '-value');
  element_size.value = pattern_size[direction];
  element_size_display.innerHTML = pattern_size[direction];
  (function (dir) {
    element_size.addEventListener('input', function() {
      pattern_size[dir] = element_size.value;
      element_size_display.innerHTML = pattern_size[dir];
      generatePattern(use_symetry);
    });
  })(direction);
}

const pattern_symetry = document.querySelector('#pattern-symetry');
pattern_symetry.addEventListener('change', function() {
  use_symetry = pattern_symetry.checked;
  const element_size = document.getElementById('pattern-size-width');
  if (use_symetry) {
    element_size.setAttribute('min', 2);
    element_size.setAttribute('step', 2);
  }
  else {
    element_size.setAttribute('min', 1);
    element_size.setAttribute('step', 1);
  }
  pattern_symetry.classList.toggle('neumorphism-out');
  generatePattern(use_symetry);
  element_size.value = pattern_size.width;
  const element_size_display = document.getElementById('pattern-size-width-value');
  element_size_display.innerHTML = pattern_size.width;
});

const pattern_elements_weight = document.querySelector('#pattern-elements-weight');
for (let i = 1; i <= pattern_elements_weight_list.length; i++) {
  const div = document.createElement('div');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '25');
  svg.setAttribute('height', '25');
  svg.innerHTML = '<use href="pattern_shapes_sprite.svg#svg-' + i + '"></use>';
  const slider = document.createElement('input');
  slider.setAttribute('type', 'range');
  slider.setAttribute('min', '0');
  slider.setAttribute('max', '10');
  slider.setAttribute('value', pattern_elements_weight_list[i-1].weight);
  div.appendChild(svg);
  div.appendChild(slider);
  div.classList.add('pattern-modification__group__element');
  pattern_elements_weight.appendChild(div);
  (function (index) {
    slider.addEventListener('input', function() {
      pattern_elements_weight_list[index-1].weight = slider.value;
      generatePattern(use_symetry);
    });
  })(i);
}

const buttons = document.querySelectorAll('.neumorphism-btn')
for (button of buttons) {
  (function (btn) {
    let mouse_down = false;
    btn.addEventListener('mousedown', function() {
      btn.classList.toggle('neumorphism-out');
      mouse_down = true;
    });
    btn.addEventListener('mouseup', function() {
      btn.classList.toggle('neumorphism-out');
      mouse_down = false;
    });
    btn.addEventListener('mouseleave', function() {
      if (mouse_down) {
        btn.classList.toggle('neumorphism-out');
      }
      mouse_down = false;
    });
    btn.addEventListener('mouseenter', function() {
      if (mouse_down) {
        btn.classList.toggle('neumorphism-out');
      }
    });
  })(button);
}

const pattern_regenerate = document.querySelector('#pattern-regenerate');
pattern_regenerate.addEventListener('click', function() {
  generatePattern(use_symetry);
  pattern_regenerate.classList.add('neumorphism-out');
  setTimeout(function() {
    pattern_regenerate.classList.remove('neumorphism-out');
  }, 250);
});

const menu_toggle = document.querySelector('.menu-btn');
const menu = document.querySelector('.pattern-menu');
menu_toggle.addEventListener('click', function() {
  menu_toggle.classList.toggle('menu-btn--open');
  menu.classList.toggle('pattern-menu--open');
  menu.classList.toggle('neumorphism-out');
  menu_toggle.classList.toggle('neumorphism-out');
});
