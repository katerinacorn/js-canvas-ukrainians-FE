//     "Позначка часу",
//     "Чи працюєте ви зараз?",
//     "Де ви мешкаєте?",
//     "Ваша стать",
//     "Ваш вік",
//     "Яка у вас освіта?",
//     "Загальний стаж роботи в ІТ",
//     "Знання англійської мови",
//     "Оберіть вашу посаду",
//     "Middle",
//     "Вкажіть вашу основну спеціалізацію",
//     "Основна мова програмування",
//     "Інші мови програмування",
//     "Фреймворки, бібліотеки та платформи",
//     "Платформи, для яких розробляєте на поточному місці роботи?",
//     "Ваш тайтл",
//     "Вкажіть вашу спеціалізацію",
//     "Яку мову програмування використовуєте в роботі?",
//     "Оберіть вашу посаду_1",
//     "Ваш тайтл_2",
//     "Ваша посада",
//     "Ваш тайтл_3",
//     "Оберіть вашу посаду_4",
//     "Ваш тайтл_5",
//     "Ваша посада_6",
//     "Ваш тайтл_7",
//     "Ваша посада_8",
//     "Ваш тайтл_9",
//     "Ваша посада_10",
//     "Ваш тайтл_11",
//     "Ваша посада_12",
//     "Ваш тайтл_13",
//     "Ваша посада_14",
//     "В якій сфері працюєте ви / ваш поточний проєкт?",
//     "Тип компанії",
//     "Кількість спеціалістів у вашій компанії (в Україні)",
//     "Загальний стаж роботи за нинішньою спеціалізацією",
//     "Стаж на поточному місці роботи",
//     "Зарплата у $$$ за місяць, лише ставка після сплати податків",
//     "Наскільки змінилась ваша зарплата за останні 12 місяців?",
//     "Чи отримуєте ви грошові бонуси до зарплати?",
//     "Вкажіть суму цього бонуса у  після податків",
//     "Вкажіть ваш основний заклад вищої освіти (якщо вчилися в кількох – той, де провели найбільше часу)"

import DOU_2021_JUNE_RAW from './2021_june_raw.js';
import CSS_COLOR_NAMES from './css_colors.js';

// TODO
const data = DOU_2021_JUNE_RAW.map(row => ({
    city: row[2],
    specialization: row[10],
    salary: row[38],
}));

const frontEndDevelopers = data.filter(key => key.specialization === "Front-end");

const developersInCity = Object
    .entries(
        frontEndDevelopers
        .reduce((all, current) => ({
            ...all,
            [current.city]: [...(all[current.city] || []), current]
        }), {})
    )
    .map(entry => [
        entry[0],
        entry[1].length * 100 / frontEndDevelopers.length,
        entry[1].reduce((all, current) => all + +current.salary, 0) / entry[1].length, //average
    ]);


[...developersInCity].sort(([, , a], [, , b]) => b - a)
    .forEach(([city, , salary]) => {
        console.log(`Average salary of FE developers in ${city} is $${Math.round(salary)}`)
    });

//draw diagram
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let start = 0;

[...developersInCity].sort(([, a, ], [, b, ]) => b - a).forEach(([city, percent], index) => {
    //chart
    ctx.fillStyle = CSS_COLOR_NAMES[index];
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, start, start -= percent * Math.PI / 50, true);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();

    //legend
    const height = canvas.height / developersInCity.length;
    ctx.fillRect(5, height * index + (height - 15) / 2, 15, 15);
    ctx.font = "12px Calibri";
    ctx.fillStyle = "grey";
    ctx.fillText(`${city} ${percent.toFixed(2)} %`, 30, height * index + (height + 10) / 2);

});

console.log("%c CONSTANTS", "color: green; font-size: 12px; font-weight: bold", {
    data,
    frontEndDevelopers,
    developersInCity,
});