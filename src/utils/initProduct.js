const categories = ['T-shirts', 'Dresses', 'Jeans', 'Sweaters', 'Shirts']
const materials = ['Cotton', 'Polyester', 'Denim', 'Wool', 'Silk']

const sizes = ['S', 'M', 'L', 'XL']
const names = {
    en: [
        'Cool and breezy summer dress',
        "Men's Sports T-shirt",
        "Men's Sports Shoes",
        "Women's Windbreaker Jacket",
        "Men's Jeans",
        "Women's Round Neck T-shirt",
        "Men's Leather Jacket",
        "Women's White Shirt",
        "Women's High Heels",
        "Men's Bomber Jacket",
        "Men's Round Neck T-shirt",
        'Cool and breathable Unisex Sports T-shirt',
        "Women's Sports T-shirt",
        "Men's Bomber Jacket",
        "Women's Trench Coat",
        "Men's Jeans",
        'Quaanf',
    ],
    vn: [
        'Váy sẻ tà thoáng mát cho mùa hè nóng bức',
        'Áo phông nam Thể thao',
        'Giày thể thao nam',
        'Áo khoác gió nữ',
        'Quần jean nam',
        'Áo thun nữ cổ tròn',
        'Áo khoác da nam',
        'Áo sơ mi nữ trắng',
        'Giày cao gót nữ',
        'Áo khoác bomber nam',
        'Áo thun nam cổ tròn',
        'Áo phông unisex Thể thao thoáng mát',
        'Áo phông nữ Thể thao',
        'Áo khoác nam dạng bomber',
        'Áo khoác nữ dạng trench',
        'Quần jean nam',
        'Quaanf ',
    ],
}

const descriptions = {
    vn: [
        'Áo phông nam Thể thao của Nike với chất liệu thoáng khí và cùng với thiết kế đơn giản sẽ giúp bạn cảm thấy thoải mái khi tập luyện.',
        'Áo phông nam Thể thao của Nike với chất liệu thoáng khí và cùng với thiết kế đơn giản sẽ giúp bạn cảm thấy thoải mái khi tập luyện.',
        'Giày thể thao nam của Adidas với thiết kế đẹp và chất liệu cao cấp sẽ giúp bạn tự tin khi tập luyện.',
        'Áo khoác gió nữ của H&M với chất liệu nhẹ và giúp chống thấm nước, phù hợp với các hoạt động ngoài trời.',
        "Quần jean nam của Levi's với chất liệu jean cao cấp và thiết kế ôm sát cơ thể sẽ giúp bạn trông thật phong cách.",
        'Áo thun nữ cổ tròn của Uniqlo với chất liệu cotton mềm mại và thiết kế đơn giản nhưng không kém phần trẻ trung và năng động.',
        'Áo khoác da nam của Polo Ralph Lauren với chất liệu da cao cấp và thiết kế sang trọng sẽ giúp bạn tạo nên phong cách lịch lãm và đẳng cấp.',
        'Áo sơ mi nữ trắng của Hollister với chất liệu cotton mềm mại và thiết kế đơn giản nhưng không kém phần thanh lịch và sang trọng.',
        'Giày cao gót nữ của Steve Madden với thiết kế đẹp và chất liệu cao cấp sẽ giúp bạn tự tin và quý phong cách của riêng mình.',
        'Áo khoác bomber nam của Tommy Hilfiger với chất liệu vải dù cao cấp và thiết kế đơn giản nhưng không kém phần nam tính và lịch lãm.',
        'Áo thun nam cổ tròn của H&M với chất liệu cotton mềm mại và thiết kế đơn giản nhưng không kém phần trẻ trung và năng động.',
        'Áo phông unisex Thể thao của Nike với chất liệu thoáng khí và cùng với thiết kế đơn giản sẽ giúp bạn cảm thấy thoải mái khi tập luyện.',
        'Áo phông nữ Thể thao của Adidas với chất liệu co giãn và cùng với thiết kế đẹp mắt sẽ giúp bạn tự tin trong mỗi bài tập.',
        'Áo khoác nam dạng bomber của Zara với chất liệu vải dù chống thấm và cùng với thiết kế hiện đại sẽ giúp bạn trông phong cách và bảo vệ khỏi thời tiết lạnh.',
        'Áo khoác nữ dạng trench của H&M với chất liệu vải dù chống thấm và cùng với thiết kế thanh lịch sẽ giúp bạn trông sang trọng và bảo vệ khỏi thời tiết lạnh.',
        "Quần jean nam của Levi's với chất liệu denim và cùng với thiết kế đơn giản sẽ giúp bạn trông trẻ trung và phong cách.",
    ],
    en: [
        "Nike Men's Sports T-shirt with breathable material and simple design will make you feel comfortable during workouts.",
        "Nike Men's Sports T-shirt with breathable material and simple design will make you feel comfortable during workouts.",
        "Adidas Men's Sports Shoes with beautiful design and premium material will make you confident during workouts.",
        "H&M Women's Windbreaker Jacket with lightweight and water-resistant material is suitable for outdoor activities.",
        "Levi's Men's Jeans made of premium denim material and slim-fit design will make you look stylish.",
        "Uniqlo Women's Round Neck T-shirt with soft cotton material and simple yet youthful and dynamic design.",
        "Polo Ralph Lauren Men's Leather Jacket made of premium leather material and sophisticated design will help you create a stylish and classy look.",
        "Hollister Women's White Shirt with soft cotton material and simple yet elegant and sophisticated design.",
        "Steve Madden Women's High Heels with beautiful design and premium material will make you confident and embrace your own style.",
        "Tommy Hilfiger Men's Bomber Jacket with premium nylon fabric material and simple yet masculine and stylish design.",
        "H&M Men's Round Neck T-shirt with soft cotton material and simple yet youthful and dynamic design.",
        'Nike Unisex Sports T-shirt with breathable material and simple design will make you feel comfortable during workouts.',
        "Adidas Women's Sports T-shirt with stretchable material and beautiful design will make you confident in every exercise.",
        "Zara Men's Bomber Jacket with water-resistant nylon fabric material and modern design will make you look stylish and protect you from cold weather.",
        "H&M Women's Trench Coat with water-resistant nylon fabric material and elegant design will make you look sophisticated and protect you from cold weather.",
        "Levi's Men's Jeans made of denim material and simple design will make you look youthful and stylish.",
    ],
}
const exchange = 24109

const colorsEnglish = [
    'Black',
    'White',
    'Gray',
    'Navy Blue',
    'Red',
    'Pink',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Purple',
    'Brown',
]
const colorsVietnamese = [
    'Đen',
    'Trắng',
    'Xám',
    'Xanh Navy',
    'Đỏ',
    'Hồng',
    'Xanh Dương',
    'Xanh lá cây',
    'Vàng',
    'Cam',
    'Tím',
    'Nâu',
]
function generateEquivalentArrays() {
    // Hàm xáo trộn mảng
    function shuffle(arr) {
        const array = [...arr]
        let currentIndex = array.length
        let temporaryValue, randomIndex

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }

        return array
    }

    // Xáo trộn mảng colorsEnglish
    const shuffledColorsEnglish = shuffle(colorsEnglish)
    // Lấy 5 phần tử đầu tiên
    const array1 = shuffledColorsEnglish.slice(0, 5)

    // Tìm chỉ mục của các phần tử trong mảng ban đầu
    const indices = array1.map((color) => colorsEnglish.indexOf(color))

    // Sử dụng chỉ mục đã tìm được để lấy các phần tử tương đương từ mảng colorsVietnamese
    const array2 = indices.map((index) => colorsVietnamese[index])

    return [array1, array2]
}

function quantity() {
    let nums = [363, 330, 330, 792, 780, 123, 108, 201, 744, 140]
    return nums[Math.floor(Math.random() * nums.length)]
}

module.exports = {
    categories,
    materials,
    exchange,
    sizes,
    names,
    descriptions,
    randomColor: generateEquivalentArrays,
    quantity: quantity,
}
