const reverse = (string) => {
	return string.split('').reverse().join('')
}

const average = (array) => {
	const reducer = (sum, item) => {
		return sum + item
	}
	return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length
}

const totalLikes = (blogs) => {
	const sum = blogs.reduce(
		(previousValue, currentValue) => previousValue + currentValue.likes,
		0
	)
	return sum
}

const favoriteBlog = (blogs) => {
	const biggestValue = Math.max(...blogs.map((blog) => blog.likes))
	const result = blogs.find((blog) => {
		return blog.likes === biggestValue
	})
	if (result !== undefined) {
		delete result.__v
		delete result.url
		delete result._id
		return result
	}
	return 0
}

module.exports = {
	reverse,
	average,
	totalLikes,
	favoriteBlog,
}
