import * as React from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TreasureModal from './modals/TreasureModal';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
function App() {

    const [editInputs, setEditInputs] = React.useState(true)
    const [result, setResult] = React.useState('')
    const [row, setRow] = React.useState('3')
    const [validationRow_message, setValidationRow_message] = React.useState('')
    const [column, setColumn] = React.useState('3')
    const [validationColumn_message, setValidationColumn_message] = React.useState('')
    const [target, setTarget] = React.useState('3')
    const [validationTarget_message, setValidationTarget_message] = React.useState('')
    const [matrix, setMatrix] = React.useState<Array<Array<string>>>(initializeMatrix())
    const [history, setHistory] = React.useState<Array<TreasureModal>>(new Array())
    const [validationMatrix_messages, setValidationMatrix_messages] = React.useState('')
    const [snackbarOpen, setSnackbarOpen] = React.useState(false)
    const [snackbarMessage, setSnackbarMessage] = React.useState({ message: '', type: 'success' })

    const openSnackbar = (message: string, type: string) => {
        setSnackbarMessage({ message: message, type: type == '' ? 'success' : type, })
        setSnackbarOpen(true);
    };

    const closeSnackbar = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };

    React.useEffect(() => { getAll(); }, []);
    function initializeMatrix(): Array<Array<string>> {
        //return initializeMatrix1()
        let intRow = parseInt(row)
        let intColumn = parseInt(column)
        let tmpMaxtrix = new Array()
        for (var count = 0; count < (intRow); count++) {
            let rowInst = new Array<string>();
            for (var subCount = 0; subCount < (intColumn); subCount++) {
                rowInst.push('1')
            }
            tmpMaxtrix[count] = rowInst
        }
        return tmpMaxtrix
    }

    return (
        <div key="div_app_main">
            <Box
                component="form"
                noValidate
                autoComplete="off"
            >
                <h1 id="tableLabel">Find Treasure</h1>
                <div className="row" key="div_test">
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        className="update-matrix-button"
                        onClick={() => { testCase1() }}>
                        Test case 1
                    </Button>&nbsp;&nbsp;
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        className="update-matrix-button"
                        onClick={() => { testCase2() }}>
                        Test case 2
                    </Button>&nbsp;&nbsp;
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        className="update-matrix-button"
                        onClick={() => { testCase3() }}>
                        Test case 3
                    </Button>
                </div>
                <div className="row input-row" key="div_inputs">
                    <div className="row" key="div_inputs-label">
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
                            key="inpRow"
                            label="Rows (n)"
                            value={row} onChange={(event) => { setRow(event.target.value); validateRow(event.target.value);  }}
                            size="small"
                            error={validationRow_message != ''}
                            type="number"
                            helperText={validationRow_message}
                            disabled={!editInputs}
                        />
                        <TextField
                            required
                            id="inpColunm"
                            key="inpColunm"
                            label="Colunms (m)"
                            value={column} onChange={(event) => { setColumn(event.target.value); validateCol(event.target.value);  }}
                            size="small"
                            error={validationColumn_message != ''}
                            type="number"
                            helperText={validationColumn_message}
                            disabled={!editInputs}
                        />
                        <TextField
                            required
                            id="inpTarget"
                            key="inpTarget"
                            label="Target (p)"
                            value={target} onChange={(event) => { setTarget(event.target.value);  validateTarget(event.target.value); }}
                            size="small"
                            type="number"
                            error={validationTarget_message != ''}
                            helperText={validationTarget_message}
                            disabled={!editInputs}
                        />
                        <Button variant="contained" color="secondary" size="small" className="update-matrix-button" onClick={() => { layoutMatrix() }}>
                            {editInputs ? 'layout matrix' : 'change' }
                        </Button>
                    </Box>
                </div>
                <Box
                    component="section"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '12ch' } }}
                >
                    <div className="row row-left-align" key="div_inputs_matrix_label">
                        <span className="main-lable" > Island Matrix : </span>
                    </div>
                    <div className="row" key="div_alert">
                        <Alert
                            className={validationMatrix_messages == '' ? "app-alert-hidden" : "app-alert"}
                            severity="error"
                            variant="outlined"
                            sx={{ width: '80%' }}
                        >
                            {validationMatrix_messages ? validationMatrix_messages : undefined}
                        </Alert>
                    </div>
                    {matrix.map((row, rowIndex) =>
                        <div className="row" key={"div_matrix_" + rowIndex}>
                            {row.map((item, columnIndex) =>
                                <TextField
                                    required
                                    id={'inpMaxtri_' + rowIndex + '_' + columnIndex}
                                    key={'inpMaxtri_' + rowIndex + '_' + columnIndex}
                                    label={'Row ' + (rowIndex +1) + ' - Col ' + (columnIndex + 1)}
                                    defaultValue={item} onChange={(event) => { matrixUpdateItem(rowIndex, columnIndex, event.target.value) }}
                                    type="number"
                                    size="small"
                                    disabled={editInputs}
                                />
                            )}
                        </div>
                    )}
                </Box>
                <div className="row" key="div_outputs_result">
                    <Button variant="contained" color="success" size="small" disabled={editInputs} onClick={() => { findTreasure1() }}>
                        Find
                    </Button> &nbsp;&nbsp;
                    <Button variant="contained" color="secondary" size="small" disabled={editInputs} onClick={() => { resetData() }}>
                        Reset
                    </Button>
                </div>
                <div className="row output-row row-left-align" key="div_outputs">
                    <span className="main-lable" > Output: </span>
                    {result}
                </div>
                
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right',} }
                open={snackbarOpen} onClose={closeSnackbar}
                autoHideDuration={6000} 
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={snackbarMessage ? snackbarMessage.type : "success"}
                    variant="filled"
                    sx={{ width: '100%' }}
                    size="small"
                    hidden
                >
                    {snackbarMessage ? snackbarMessage.message : undefined}
                </Alert>
            </Snackbar>
        </div>
    );

    async function getAll() {
        const response = await fetch('weatherforecast');
        if (response.ok) {
            const data = await response.json();

            setHistory(data);
            console.log(data)
        }
    }

    async function insert2Server(minDistance: number) {
        var dataTemp = new TreasureModal()
        dataTemp.row = row
        dataTemp.column = column
        dataTemp.target = target
        dataTemp.result = minDistance
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
        if (!result) openSnackbar('Data input is invalid', 'error')
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
                let value = (matrix[count][subCount] + '').trim()
                let subResult = true
                if (value == null || value == '') {
                    message += 'Item (' + count + '-' + subCount + ') is required' + '. '
                    subResult = subResult && false
                }
                if (isNaN(Number(value))) {
                    message += 'Item (' + count + '-' + subCount + ') must integer' + '. '
                    subResult = subResult && false
                }
                let intValue = parseInt(value)
                if (intValue < 1) {
                    message += 'Item (' + count + '-' + subCount + ') must a positive integer.'
                    subResult = subResult && false
                }
                result = subResult && result
            }
        }
        setValidationMatrix_messages(message)
        return result
    }

    
    function findTreasure1() {
        try {
            openSnackbar('findTreasure1 Start validation', 'info')
            console.log('findTreasure1 Start validation')
            if (!validateData()) return
            let intRow = parseInt(row)
            let intCol = parseInt(column)
            let intTarget = parseInt(target)
            console.log('findTreasure1 Start ', intRow, intCol, intTarget, matrix)
            let currentStepX = 0
            let distance = 0
            let x1 = 1
            let y1 = 1
            let rootNode = { stepX: currentStepX, x: x1, y: y1, distance: distance, target: intTarget, subNodes: null }
            rootNode.subNodes = findAndFillNodes(rootNode.stepX + 1, intTarget, intRow, intCol, rootNode.x, rootNode.y)
            console.log('findTreasure1 - findAndFindNodes - end', intRow, intCol, intTarget, matrix, rootNode)

            let arrayDistance = new Array() // {steps: string, distance: number}
            calculateDistance(rootNode, 'start', rootNode.distance, arrayDistance)

            console.log('findTreasure1 - calculateDistance - end', rootNode, arrayDistance)

            let minStep: any = null;
            for (var countDistance = 0; countDistance < arrayDistance.length; countDistance++) {
                if (minStep == null) {
                    minStep = arrayDistance[countDistance]
                }
                else if (minStep.distance > arrayDistance[countDistance].distance) minStep = arrayDistance[countDistance]
            }
            setResult(minStep.distance + '  (Steps: ' + minStep.steps +')')
            console.log('Found the treasure. Steps: ' + minStep.steps + '. Distance: ' + minStep.distance)
            openSnackbar('Found the treasure. Steps: ' + minStep.steps + '. Distance: ' + minStep.distance, '')
            insert2Server(minStep.distance)
        } catch (e) {
            if (e instanceof RangeError) {
                console.log("You can not found Treasure", e) 
                openSnackbar("You can not found Treasure", 'error')
            } else {
                console.log("Have issues, please contact with administrator", e) 
                openSnackbar("Have issues, please contact with administrator", 'error') 
            }
        }
        
    }

    // inputs - node: any, logSteps: string, totalDistance: number, arrayDistance: Array<{steps: string, distance: number}>
    function calculateDistance(node: any, logSteps: string, totalDistance: number, arrayDistance: Array<any>) {
        if (node.subNodes == null) {
            logSteps += '->(' + node.x + ',' + node.y + ')'
            console.log("calculateDistance - null", logSteps, totalDistance + node.distance) 
            arrayDistance.push({ steps: logSteps, distance: totalDistance + node.distance })
            return 
        }

        logSteps += '->(' + node.x + ',' + node.y + ')'
        for (var countNode = 0; countNode < node.subNodes.length; countNode++) {
            console.log("calculateDistance - call", node.subNodes[countNode]) 
            calculateDistance(node.subNodes[countNode], logSteps, totalDistance + node.distance, arrayDistance)
        }
    }

    // inputs - nextStepX: number, inpTarget: number, totalRow: number, totalCol: number, x1: number, y1: number
    // return - nodes: { stepX: currentStepX, x: x1, y: y1, distance: distance, target: intTarget, subNodes: null }
    function findAndFillNodes(nextStepX: number, inpTarget: number, totalRow: number, totalCol: number, x1: number, y1: number): any {
        if (nextStepX > inpTarget) {
            console.log('findAndFindNodes - return null')
            return null
        }
        console.log('findAndFindNodes start', nextStepX, inpTarget, totalRow, totalCol, x1, y1)
        let setNextNodes = new Array()
        let distance = 0
        let hasChildNode = false
        for (var countRow = 0; countRow < totalRow; countRow++) {
            for (var countCol = 0; countCol < (totalCol); countCol++) {
                if ((matrix[countRow][countCol]).trim() != (nextStepX+'')) continue

                hasChildNode = true
                distance = Math.sqrt(Math.pow(x1 - (countRow + 1), 2) + Math.pow((y1 - (countCol + 1)), 2))
                let node = { stepX: nextStepX, x: countRow + 1, y: countCol + 1, distance: distance, target: inpTarget, subNodes: null }
                node.subNodes = findAndFillNodes(node.stepX + 1, inpTarget, totalRow, totalCol, node.x, node.y)

                setNextNodes.push(node)
            }
        }
        if (!hasChildNode) throw new RangeError('findAndFillNodes top at: nextStepX-' + nextStepX + ',Target-' + inpTarget + ',totalRow-' + totalRow + ',totalCol-' + totalCol + ',x1-' + x1 + ',y1-' + y1);
        console.log('findAndFindNodes end', nextStepX, inpTarget, totalRow, totalCol, x1, y1, setNextNodes)
        return setNextNodes
    }
    
   /*
    function findTreasure() {
        console.log('findTreasure ', matrix)
        if (!validateData()) return
        let currentStepX = 0
        let distance = 0
        let x1 = 1
        let y1 = 1
        let stepCount = 0
        let intTarget = parseInt(target)
        while (currentStepX < (intTarget)) {
            let stepValue = findStepX(currentStepX + 1, x1, y1)
            if (stepValue.nextStepX == intTarget && stepValue.minDistance == 0) {
                console.log('can not found treasure ')
                return
            }
            distance = distance + stepValue.minDistance
            console.log('Step ' + (++stepCount) + ': x1 - ' + x1 + ', y1 - ' + y1 + ', x2 - ' + stepValue.x2 + ', y2 - ' + stepValue.y2 + ', minDistance - ' + stepValue.minDistance)
            currentStepX = stepValue.nextStepX
            x1 = stepValue.x2
            y1 = stepValue.y2
        }

        setResult(distance)
        console.log('result ' + distance)
        openSnackbar("Found the treasure", '')

        insert2Server(distance)
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
            openSnackbar("You can not found Treasure", 'error') 
            return { nextStepX: inttarget, x2, y2, minDistance }
        }
        return { nextStepX, x2, y2, minDistance }
    }
    */
    function resetData() {
        setMatrix(new Array(new Array()))
        setValidationRow_message('')
        setValidationColumn_message('')
        setValidationTarget_message('')
        setValidationMatrix_messages('')
        setResult('')
        setTimeout(() => {
            setMatrix(initializeMatrix())
            console.log('resetData', matrix)
            openSnackbar("Reseted", '') 
        }, 500)
        
    }

    function layoutMatrix() {

        if (editInputs == false) {
            setEditInputs(!editInputs)
            return
        }
        
        let resultValidate = true;
        resultValidate = resultValidate && validateRow(row)
        resultValidate = resultValidate && validateCol(column)
        resultValidate = resultValidate && validateTarget(target)
        if (resultValidate == false) return

        setEditInputs(!editInputs)
        setMatrix(new Array(new Array()))
        setValidationRow_message('')
        setValidationColumn_message('')
        setValidationTarget_message('')
        setValidationMatrix_messages('')
        setResult('')

        setTimeout(() => {
            setMatrix(initializeMatrix())
            console.log('layoutMatrix', matrix)
        }, 500)
        
    }

    function matrixUpdateItem(iRow: number, iCol: number, value: string) {
        //let result = true
        let intRow = iRow
        let intColumn = iCol
        //let message = ''
        //if (value == null || value == '') {
        //    message += 'Item (' + intRow + '-' + intColumn + ') is required'
        //    result = result && false
        //}
        //if (isNaN(Number(value))) {
        //    message += 'Item (' + intRow + '-' + intColumn + ') must integer'
        //    result = result && false
        //}
        //let intValue = parseInt(value)
        //if (intValue < 1 || intValue > parseInt(row) * parseInt(column)) {
        //    message += 'Item (' + intRow + '-' + intColumn + ') must "1 <= p <= m*n"'
        //    result = result && false
        //}
        //if (!result) {
        //    setValidationMatrix_messages(message)
        //    console.log('matrixUpdateItem' + message)
        //}
        matrix[intRow][intColumn] = value
        setMatrix(matrix)
        console.log('Item (' + row + '-' + intColumn + ') updated value: ' + value, matrix)
    }

    function testCase1() {
        setEditInputs(false)
        setRow('3')
        setColumn('3')
        setTarget('3')
        setValidationRow_message('')
        setValidationColumn_message('')
        setValidationTarget_message('')
        setValidationMatrix_messages('')
        setResult('')
        setMatrix(new Array(new Array()))
        let tmpMaxtrix = new Array(
            new Array('3', '2', '2'),
            new Array('2', '2', '2'),
            new Array('2', '2', '1'),
        )

        setTimeout(() => {
            setMatrix(tmpMaxtrix)
            console.log('Loaded data for "Test Case 1"', matrix)
            openSnackbar('Loaded data for "Test Case 1"', '')

        }, 500)
    }

    function testCase2() {
        setEditInputs(false)
        setRow('3')
        setColumn('4')
        setTarget('3')
        setValidationRow_message('')
        setValidationColumn_message('')
        setValidationTarget_message('')
        setValidationMatrix_messages('')
        setResult('')
        setMatrix(new Array(new Array()))

        setTimeout(() => {
            let tmpMaxtrix = new Array(
                new Array('2', '1', '1', '1'),
                new Array('1', '1', '1', '1'),
                new Array('2', '1', '1', '3'),
            )
            setMatrix(tmpMaxtrix)
            console.log('Loaded data for "Test Case 2"', matrix)
            openSnackbar('Loaded data for "Test Case 2"', '')

        }, 500)
    }

    function testCase3() {
        setEditInputs(false)
        setRow('3')
        setColumn('4')
        setTarget('12')
        setValidationRow_message('')
        setValidationColumn_message('')
        setValidationTarget_message('')
        setValidationMatrix_messages('')
        setResult('')
        setMatrix(new Array(new Array()))

        setTimeout(() => {
            let tmpMaxtrix = new Array(
                new Array('1', '2', '3', '4'),
                new Array('8', '7', '6', '5'),
                new Array('9', '10', '11', '12'), 

            )
            setMatrix(tmpMaxtrix)
            console.log('Loaded data for "Test Case 3"', matrix)
            openSnackbar('Loaded data for "Test Case 3"', '')

        }, 500)
    }
}

export default App;