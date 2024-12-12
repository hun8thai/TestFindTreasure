class TreasureModal {

    row: string = ''
    column: string = ''
    target: string = ''
    matrixString: string = ''
    result: number = 0

    setMatrixString(data: Array<Array<number>>) {
        let msg = ''
        for (var count = 0; count < data.length; count++) {
            for (var subCount = 0; subCount < data[count].length; subCount++) {
                msg += data[count][subCount]+'|'
            }
            
        }
        this.matrixString = msg
    }

    getMatrix(): Array<Array<number>> {
        let data = new Array()
        let intRow = parseInt(this.row)
        let intColumn = parseInt(this.column)
        let temp = this.matrixString.split('|')
        for (var count = 0; count < intRow; count++) {
            let row = new Array()
            for (var subCount = 0; subCount < intRow; subCount++) {

                row.push(parseInt(temp[count * intRow + subCount]))
            }
            data.push(row)
        }

        return data
    }
}
export default TreasureModal;