import dayjs from 'dayjs'


const _getDateString = () => {
	return '\x1b[2m' + `\n${ dayjs().format('HH:mm:ss') }` + '\x1b[0m'
}


const log = ( ...messages ) => {
	console.log(_getDateString())
	console.log(...messages, '\n')
}


export default {
	log
}