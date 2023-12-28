function hasLangKey(obj, key) {
    return Object.hasOwn(obj, key)
}

function checkArray(obj) {
    return Array.isArray(obj)
}
function handleArrayItem(obj, lang) {
    return { key: obj.label[lang], value: obj?.value[lang] ? obj.value[lang] : obj.value }
}

module.exports.filterProductByLang = (prod, lang = 'vn') => {
    const product = JSON.parse(JSON.stringify(prod))
    const keys = Object.keys(product)
    let copy = {}
    keys.forEach((item, index) => {
        if (hasLangKey(product[item], lang)) {
            copy[item] = product[item][lang]
        } else if (checkArray(product[item])) {
            const result = product[item].map((item) => handleArrayItem(item, lang))
            copy[item] = result
        } else {
            copy[item] = product[item]
        }
    })
    return copy
}

const prod = {
    _id: '65889c11191a4627d2d330d4',
    name: {
        vn: 'Váy trắng công chua trễ vai',
        en: 'Off-the-shoulder princess white dress',
        _id: '65889c11191a4627d2d330d5',
    },
    price: {
        vn: 150000,
        en: 15,
        _id: '65889c11191a4627d2d330d6',
    },
    brand: {
        vn: 'Y&M shop',
        en: 'Y&M shop',
        _id: '65889c11191a4627d2d330d7',
    },
    description: {
        en: 'The most beautiful dresses today, youthful beautiful dresses, jump dresses, beautiful Korean dresses, parties The best dresses today, beautiful dresses for weddings, luxurious dresses, beautiful dresses, beautiful dresses today,  Luxurious party dresses, beautiful dresses 2022, the best A-line dresses, square neck dress models, beautiful dress models for young people, beautiful dresses for parties, beautiful dresses, dresses, dresses, beautiful dresses 2022, style dresses, luxurious party dresses, beautiful dresses, square neck dresses, square neck dresses',
        vn: 'những mẫu váy đẹp nhất hiện nay, mẫu đầm đẹp trẻ trung, mẫu váy xòe liền thân, váy đẹp hàn quốc, dự tiệc những mẫu váy đẹp nhất hiện nay, mẫu váy đẹp dự đám cưới, những mẫu đầm sang trọng, những mẫu váy đẹp sang chảnh, đầm suông những mẫu váy đẹp nhất hiện nay, đầm dự tiệc sang chảnh, váy đẹp 2022, những mẫu đầm chữ a đẹp nhất, mẫu váy cổ vuông, các mẫu váy đẹp cho giới trẻ, đầm đẹp dự tiệc, váy đẹp, áo đầm, váy, váy đẹp 2022, đầm kiểu, đầm dự tiệc sang chảnh, những mẫu đầm, đầm đẹp dự tiệc, váy cổ vuông, cổ vuông',
        _id: '65889c11191a4627d2d330d8',
    },
    rates: [],
    options: [
        {
            value: {
                en: 'red,green',
                vn: 'đỏ,xanh',
            },
            key: 'colors',
            label: { en: 'Colors', vn: 'Màu Sắc' },
        },
        {
            key: 'sizes',
            value: ['S', 'M'],
            label: {
                en: 'Sizes',
                vn: 'Kích Thước',
            },
        },
    ],
    images: {
        main: 'https://res.cloudinary.com/develope-app/image/upload/v1703451659/ymshop/psnsbd9hcru9kife5xjk.jpg',
        list: [Array],
    },
    specs: [
        {
            key: 'Category',
            label: { vn: 'Thể Loại', en: 'Category' },
            value: 3454,
        },
        {
            key: 'weight',
            label: { vn: 'Cân Nặng', en: 'weight' },
            value: 4646,
        },
        {
            key: 'material',
            label: { vn: 'Chất Liệu', en: 'Material' },
            value: 3464,
        },
    ],
    inventory: { selled: 0 },
    release_date: '2023-12-24T21:01:05.156Z',
    __v: 0,
}

const prod2 = {
    _id: '64f290e6e30792fe4c98947d',
    name: {
        vn: 'Áo phông unisex Thể thao thoáng mát',
        en: 'Cool and breathable Unisex Sports T-shirt',
        _id: '64f290e6e30792fe4c98947e',
    },
    price: {
        vn: 280402,
        en: 8.1,
        _id: '64f290e6e30792fe4c98947f',
    },
    brand: {
        en: 'Y&M Shop',
        vn: 'Y&M Shop',
        _id: '64f290e6e30792fe4c989480',
    },
    description: {
        en: 'Nike Unisex Sports T-shirt with breathable material and simple design will make you feel comfortable during workouts.',
        vn: 'Áo phông unisex Thể thao của Nike với chất liệu thoáng khí và cùng với thiết kế đơn giản sẽ giúp bạn cảm thấy thoải mái khi tập luyện.',
        _id: '64f290e6e30792fe4c989481',
    },
    release_date: '2023-09-02T01:33:26.998Z',
    rates: [],
    options: [
        {
            value: {
                en: 'red,green',
                vn: 'đỏ,xanh',
            },
            key: 'colors',
            label: { en: 'Colors', vn: 'Màu Sắc' },
        },
        {
            key: 'sizes',
            value: ['S', 'M'],
            label: {
                en: 'Sizes',
                vn: 'Kích Thước',
            },
        },
    ],
    images: {
        list: [],
        main: 'https://res.cloudinary.com/develope-app/image/upload/v1684749193/shopv2/photo-1515886657613-9f3515b0c78f-da33cfc8db67.webp',
    },
    specs: [
        {
            key: 'Category',
            label: { vn: 'Thể Loại', en: 'Category' },
            value: 3454,
        },
        {
            key: 'weight',
            label: { vn: 'Cân Nặng', en: 'weight' },
            value: 4646,
        },
        {
            key: 'material',
            label: { vn: 'Chất Liệu', en: 'Material' },
            value: 3464,
        },
    ],
    inventory: { selled: 3 },
    __v: 0,
}
