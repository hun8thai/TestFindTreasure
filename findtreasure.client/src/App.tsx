import * as React from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TreasureModal from './modals/TreasureModal';

function App() {

    const [result, setResult] = React.useState(0)
    const [row, setRow] = React.useState('3')
    const [validationRow_message, setValidationRow_message] = React.useState('')
    const [column, setColumn] = React.useState('3')
    const [validationColumn_message, setValidationColumn_message] = React.useState('')
    const [target, setTarget] = React.useState('3')
    const [validationTarget_message, setValidationTarget_message] = React.useState('')
    const [matrix, setMatrix] = React.useState(initializeMatrix1())
    const [history, setHistory] = React.useState<Array<TreasureModal>>(new Array())
    const [validationMatrix_messages, setValidationMatrix_messages] = React.useState('')

    React.useEffect(() => {
        getAll();
    }, []);
    function initializeMatrix(): Array<Array<number>> {
        //return initializeMatrix1()
        let intRow = parseInt(row)
        let intColumn = parseInt(column)
        let tmpMaxtrix = new Array()
        for (var count = 0; count < (intRow); count++) {
            let rowInst: number[] = new Array<number>();
            for (var subCount = 0; subCount < (intColumn); subCount++) {
                rowInst.push(0)
            }
            tmpMaxtrix[count] = rowInst
        }
        return tmpMaxtrix
    }

    function initializeMatrix1(): Array<Array<number>> {
        //setRow('3')
        //setColumn('3')
        //setTarget('3')
        let tmpMaxtrix = new Array(
            new Array(3, 2, 2),
            new Array(2, 2, 2),
            new Array(2, 2, 1),
        )
        return tmpMaxtrix;
    }

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
        >
            <h1 id="tableLabel">Find Treasure</h1>
            <Button 
                id="outlined-message-error"
                value={validationMatrix_messages}
                size="small" color="error"
                hidden={validationMatrix_messages == ''}
            >
                {validationMatrix_messages}
            </Button>
            <div className="row input-row">
                <div className="row">
                    <span  className="main-lable" >
                        Inputs:
                    </span>
                </div>
                <Box
                    component="section"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                >
                    <TextField
                        required
                        id="inpRow"
                        name="inpRow"
                        label="Rows (n)"
                        defaultValue={row} onBlur={(event) => { if (validateRow(event.target.value)) setRow(event.target.value) }}
                        size="small"
                        error={validationRow_message != ''}
                        type="number"
                        helperText={validationRow_message}
                    />
                    <TextField
                        required
                        id="inpColunm"
                        name="inpColunm"
                        label="Colunms (m)"
                        defaultValue={column} onBlur={(event) => { if (validateCol(event.target.value)) setColumn(event.target.value) }}
                        size="small"
                        error={validationColumn_message != ''}
                        helperText={validationColumn_message}
                    />
                    <TextField
                        required
                        id="inpTarget"
                        name="inpTarget"
                        label="Target (p)"
                        defaultValue={target} onBlur={(event) => { if (validateTarget(event.target.value)) setTarget(event.target.value) }}
                        size="small"
                        error={validationTarget_message != ''}
                        helperText={validationTarget_message}
                    />
                    <Button variant="contained" color="secondary" size="small" className="update-matrix-button" onClick={() => { layoutMatrix() }}>
                        Update matrix
                    </Button>
                </Box>
            </div>
            <Box
                component="section"
                sx={{ '& .MuiTextField-root': { m: 1, width: '12ch' } }}
            >
                {matrix.map((row, rowIndex) =>
                    <div className="row">
                        {row.map((item, columnIndex) =>
                            <TextField
                                required
                                id={'inpMaxtri_' + rowIndex + '_' + columnIndex}
                                name={'inpMaxtri_' + rowIndex + '_' + columnIndex}
                                label={'Row ' + (rowIndex +1) + ' - Col ' + (columnIndex + 1)}
                                defaultValue={item} onBlur={(event) => { matrixUpdateItem(rowIndex, columnIndex, event.target.value) }}
                                size="small"
                            />
                        )}
                    </div>
                )}
            </Box>
            <div className="row output-row">
                <Button variant="contained" color="success" size="small" onClick={() => { findTreasure() }}>
                    Find
                </Button> &nbsp;&nbsp;
                <Button variant="contained" color="secondary" size="small" onClick={() => { resetData() }}>
                    Reset
                </Button>
            </div>
            <div className="row row-left-align">
                <span className="main-lable" > Output: </span>
                {result}
            </div>
        </Box>
        
    );

    async function getAll() {
        const response = await fetch('weatherforecast');
        if (response.ok) {
            const data = await response.json();

            setHistory(data);
            console.log(data)
        }
    }

    async function insert2Server() {
        var dataTemp = new TreasureModal()
        dataTemp.row = row
        dataTemp.column = column
        dataTemp.target = target
        dataTemp.result = result + ''
        dataTemp.setMatrixString(matrix)

        const response = await fetch('weatherforecast', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataTemp)
        });
        if (response.ok) {
            //const data = await response.json();
            getAll()
        }
    }

    function validateData() {
        let result = true
        result = result && validateRow(row)
        result = result && validateCol(column)
        result = result && validateTarget(target)
        result = result && validateMatrix()
        if (!result) alert('data input is invalid')
        return result
    }

    function validateRow(value: string) {
        console.log('validateRow - ' + value)
        if (value == null || value == '') {
            setValidationRow_message('Row (n) is required')
            return false
        }
        if (isNaN(Number(value))) {
            setValidationRow_message('Row (n) must integer')
            return false
        }
        let intValue = parseInt(value)
        if (intValue < 1 || intValue > 500) {
            setValidationRow_message('Row (n) must "1 <= n <= 500"')
            return false
        }
        setValidationRow_message('')
        return true
    }

    function validateCol(value: string) {
        if (value == null || value == '') {
            setValidationColumn_message('Col (m) is required')
            return false
        }
        if (isNaN(Number(value))) {
            setValidationColumn_message('Col (m) must integer')
            return false
        }
        let intValue = parseInt(value)
        if (intValue < 1 || intValue > 500) {
            setValidationColumn_message('Col (m) must "1 <= n <= 500"')
            return false
        }
        setValidationColumn_message('')
        return true
    }

    function validateTarget(value: string) {
        let intRow = parseInt(row)
        let intColumn = parseInt(column)
        if (value == null || value == '') {
            setValidationTarget_message('Target (p) is required')
            return false
        }
        if (isNaN(Number(value))) {
            setValidationTarget_message('Target (p) must integer')
            return false
        }
        let intValue = parseInt(value)
        if (intValue < 1 || intValue > (intColumn) * (intRow)) {
            setValidationTarget_message('Target (p) must "1 <= p <= m*n"')
            return false
        }
        setValidationTarget_message('')
        return true
    }

    function validateMatrix() {
        let result = true
        let intRow = parseInt(row)
        let intColumn = parseInt(column)
        let message = ''
        for (var count = 0; count < (intRow); count++) {
            for (var subCount = 0; subCount < (intColumn); subCount++) {
                let value = matrix[count][subCount] + ''
                let subResult = true
                if (value == null || value == '') {
                    message += 'Item (' + count + '-' + subCount +') is required'
                    subResult = subResult && false
                }
                if (isNaN(Number(value))) {
                    message += 'Item (' + count + '-' + subCount +') must integer'
                    subResult = subResult && false
                }
                let intValue = parseInt(value)
                if (intValue < 1 || intValue > (intColumn) * (intRow)) {
                    message += 'Item (' + count + '-' + subCount +') must "1 <= p <= m*n"'
                    subResult = subResult && false
                }
                result = subResult && result
            }
        }
        setValidationMatrix_messages(message)
        return result
    }

    /*
    function findTreasure1() {
        if (!validateData()) return
        alert('Start find')
        let currentStepX = 0
        let distance = 0
        let x1 = 1
        let y1 = 1
        let stepCount = 0
        let treeResult = { nextStepX: currentStepX, x1, y1, distance, setPoints: new Array() }
        while (currentStepX < (treasureUI.target??0)) {
            let stepValue = findStepX(currentStepX + 1, x1, y1)
            treeResult
            distance = distance + stepValue.minDistance
            console.log('Step ' + (++stepCount) + ': x1 - ' + x1 + ', y1 - ' + y1 + ', x2 - ' + stepValue.x2 + ', y2 - ' + stepValue.y2 + ', minDistance - ' + stepValue.minDistance)
            currentStepX = stepValue.nextStepX
            x1 = stepValue.x2
            y1 = stepValue.y2
        }

        setResult(distance)
        console.log('result ' + distance)
    }

    function findStepX1(nextStepX: number, x1: number, y1: number) : any {
        let x2 = 1
        let y2 = 1
        let distance = 0
        let setPoints = new Array()
        for (var count = 0; count < (treasureUI.row ?? 0); count++) {
            for (var subCount = 0; subCount < (treasureUI.column ?? 0); subCount++) {
                if (treasureUI.matrix[count][subCount] != nextStepX) continue

                distance = Math.sqrt(Math.pow(x1 - (count + 1), 2) + Math.pow((y1 - (subCount + 1)), 2))
                setPoints.push({ nextStepX, x2, y2, distance })
            }
        }
        if (distance == 0) {
            alert("You can not found Treasure")
            return { nextStepX: treasureUI.target, x2, y2, distance, setPoints }
        }
        return { nextStepX, x2, y2, distance, setPoints }
    }
    */
    function findTreasure() {
        if (!validateData()) return
        let currentStepX = 0
        let distance = 0
        let x1 = 1
        let y1 = 1
        let stepCount = 0
        let intTarget = parseInt(target)
        while (currentStepX < (intTarget)) {
            let stepValue = findStepX(currentStepX + 1, x1, y1)
            distance = distance + stepValue.minDistance
            console.log('Step ' + (++stepCount) + ': x1 - ' + x1 + ', y1 - ' + y1 + ', x2 - ' + stepValue.x2 + ', y2 - ' + stepValue.y2 + ', minDistance - ' + stepValue.minDistance)
            currentStepX = stepValue.nextStepX
            x1 = stepValue.x2
            y1 = stepValue.y2
        }

        setResult(distance)
        alert('Found')
        console.log('result ' + distance)
        insert2Server()
    }

    function findStepX(nextStepX: number, x1: number, y1: number): any {
        let x2 = 1
        let y2 = 1
        let minDistance = 0
        let intRow = parseInt(row)
        let intColumn = parseInt(column)
        let inttarget = parseInt(target)

        for (var count = 0; count < (intRow); count++) {
            for (var subCount = 0; subCount < (intColumn); subCount++) {
                if (matrix[count][subCount] != nextStepX) continue

                let distance = Math.sqrt(Math.pow(x1 - (count + 1), 2) + Math.pow((y1 - (subCount + 1)), 2))
                if (minDistance == 0) {
                    minDistance = distance
                    x2 = count + 1
                    y2 = subCount + 1
                }
                else if (minDistance > distance) {
                    minDistance = distance
                    x2 = count + 1
                    y2 = subCount + 1
                }
            }
        }
        if (minDistance == 0) {
            alert("You can not found Treasure")
            return { nextStepX: inttarget, x2, y2, minDistance }
        }
        return { nextStepX, x2, y2, minDistance }
    }

    function resetData() {
        setMatrix(initializeMatrix())
        alert('Reseted')
    }

    function layoutMatrix() {
        let resultValidate = true;
        resultValidate = resultValidate && validateRow(row)
        resultValidate = resultValidate && validateCol(column)
        resultValidate = resultValidate && validateTarget(target)
        if (resultValidate == false) return
        setMatrix(initializeMatrix())
        alert('Reseted')
    }

    function matrixUpdateItem(row: number, col: number, value: string) {
        let result = true
        let intRow = row
        let intColumn = col
        let message = ''
        if (value == null || value == '') {
            message += 'Item (' + row + '-' + col + ') is required'
            result = result && false
        }
        if (isNaN(Number(value))) {
            message += 'Item (' + row + '-' + col + ') must integer'
            result = result && false
        }
        let intValue = parseInt(value)
        if (intValue < 1 || intValue > (intColumn) * (intRow)) {
            message += 'Item (' + row + '-' + col + ') must "1 <= p <= m*n"'
            result = result && false
        }
        if (!result) {
            setValidationMatrix_messages(message)
            console.log('matrixUpdateItem' + message)
            return 
        }
        console.log('Item (' + row + '-' + col + ') updated value: ' + intValue)
        matrix[row][col] = intValue
        setMatrix(matrix)
    }
}

export default App;