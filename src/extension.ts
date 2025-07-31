import * as vscode from 'vscode'

/**
 * VS Code 워크스페이스 설정에서 CSS 단위 변환기 설정을 가져오는 함수
 * @returns 설정 객체 (단위, 기준 폰트 크기, 기준 너비, 기준 높이)
 */
function getConfiguration(): {
  unit: string
  baseFontSize: number
  baseWidth: number
  baseHeight: number
} {
  const config = vscode.workspace.getConfiguration('convertCSSUnits')
  return {
    unit: config.get('unit', 'rem'), // 기본값: rem
    baseFontSize: config.get('baseFontSize', 16), // 기본값: 16px
    baseWidth: config.get('baseWidth', 1920), // 기본값: 1920px
    baseHeight: config.get('baseHeight', 1080), // 기본값: 1080px
  }
}

/**
 * px 값을 폰트 크기 기준으로 변환하는 함수 (rem, em용)
 * @param px - 변환할 px 값
 * @param criteria - 기준 폰트 크기
 * @returns 변환된 값
 */
function convertByFontSize(px: number, criteria: number): number {
  return px / criteria
}

/**
 * px 값을 너비/높이 기준으로 변환하는 함수 (vw, vh, vmin, vmax, cqw, cqh용)
 * @param px - 변환할 px 값
 * @param criteria - 기준 너비 또는 높이
 * @returns 변환된 값 (퍼센트 기반)
 */
function convertByWidthOrHeight(px: number, criteria: number): number {
  return (px / criteria) * 100
}

/**
 * 소수점 값을 자연스럽게 포맷팅하는 함수
 * - 정수인 경우 정수로 표시
 * - 소수점 끝자리가 0인 경우 제거
 * - 최대 3자리까지 표시
 * @param value - 포맷팅할 숫자
 * @returns 포맷팅된 문자열
 */
function formatDecimalValue(value: number): string {
  // 소수점 3자리로 반올림
  const rounded = Math.round(value * 1000) / 1000

  // 정수인 경우 정수로 표시
  if (rounded % 1 === 0) {
    return rounded.toString()
  }

  // 소수점 3자리로 포맷팅
  const formatted = rounded.toFixed(3)

  // 끝자리가 0인 경우 2자리로 표시
  if (formatted.endsWith('0')) {
    return rounded.toFixed(2)
  }

  // 끝자리가 00인 경우 1자리로 표시
  if (formatted.endsWith('00')) {
    return rounded.toFixed(1)
  }

  return formatted
}

/**
 * px 값을 지정된 단위로 변환하는 함수
 * @param px - 변환할 px 값
 * @param unit - 변환할 단위 (rem, em, vw, vh, vmin, vmax, cqw, cqh)
 * @param config - 설정 객체
 * @returns 변환된 값과 단위가 포함된 문자열
 */
function convertPxToUnit(
  px: number,
  unit: string,
  config: ReturnType<typeof getConfiguration>,
): string {
  const pxValue = parseFloat(px.toString())

  switch (unit) {
    case 'rem':
      return `${formatDecimalValue(
        convertByFontSize(pxValue, config.baseFontSize),
      )}rem`
    case 'em':
      return `${formatDecimalValue(
        convertByFontSize(pxValue, config.baseFontSize),
      )}em`
    case 'vw':
      return `${formatDecimalValue(
        convertByWidthOrHeight(pxValue, config.baseWidth),
      )}vw`
    case 'vh':
      return `${formatDecimalValue(
        convertByWidthOrHeight(pxValue, config.baseHeight),
      )}vh`
    case 'vmin':
      return `${formatDecimalValue(
        convertByWidthOrHeight(pxValue, config.baseWidth),
      )}vmin`
    case 'vmax':
      return `${formatDecimalValue(
        convertByWidthOrHeight(pxValue, config.baseWidth),
      )}vmax`
    case 'cqw':
      return `${formatDecimalValue(
        convertByWidthOrHeight(pxValue, config.baseWidth),
      )}cqw`
    case 'cqh':
      return `${formatDecimalValue(
        convertByWidthOrHeight(pxValue, config.baseHeight),
      )}cqh`
    default:
      return `${pxValue}px`
  }
}

/**
 * CSS 단위를 px로 변환하는 함수
 * @param unit - 변환할 단위
 * @param value - 변환할 값
 * @returns px 값
 */
function convertUnitToPx(unit: string, value: string): number {
  const { baseFontSize, baseWidth, baseHeight } = getConfiguration()
  const pxValue = parseFloat(value)

  switch (unit) {
    case 'rem':
      return pxValue * baseFontSize
    case 'em':
      return pxValue * baseFontSize
    case 'vw':
      return (pxValue * baseWidth) / 100 // 퍼센트 기반이므로 100으로 나눔
    case 'vh':
      return (pxValue * baseHeight) / 100
    case 'vmin':
      return (pxValue * baseWidth) / 100
    case 'vmax':
      return (pxValue * baseWidth) / 100
    case 'cqw':
      return (pxValue * baseWidth) / 100
    case 'cqh':
      return (pxValue * baseHeight) / 100
    default:
      return pxValue
  }
}

/**
 * 모든 CSS 단위를 변환하는 함수
 * - px인 경우: 설정된 단위로 변환
 * - 설정된 단위와 같은 경우: px로 변환
 * - 설정된 단위와 다른 경우: 무시 (그대로 반환)
 * @param value - 변환할 값과 단위가 포함된 문자열 (예: "16px", "1.5rem")
 * @param config - 설정 객체
 * @returns 변환된 값과 단위가 포함된 문자열
 */
function convertAnyUnit(
  value: string,
  config: ReturnType<typeof getConfiguration>,
): string {
  // CSS 단위를 추출하는 정규식 (숫자 + 단위)
  const unitRegex = /(\d+(?:\.\d+)?)(rem|em|vw|vh|vmin|vmax|cqw|cqh|px)/g
  const match = unitRegex.exec(value)

  if (!match) {
    return value // 단위가 없으면 그대로 반환
  }

  const [, numValue, unit] = match
  const numericValue = parseFloat(numValue)

  // px인 경우 설정된 단위로 변환
  if (unit === 'px') {
    return convertPxToUnit(numericValue, config.unit, config)
  }

  // 설정된 단위와 같은 경우에만 px로 변환
  if (unit === config.unit) {
    const pxValue = convertUnitToPx(unit, numValue.toString())
    return `${formatDecimalValue(pxValue)}px`
  }

  // 설정된 단위와 다른 경우 그대로 반환 (변환하지 않음)
  return value
}

/**
 * VS Code 확장 활성화 함수
 * 모든 명령어를 등록하고 이벤트 리스너를 설정
 * @param context - VS Code 확장 컨텍스트
 */
export function activate(context: vscode.ExtensionContext) {
  /**
   * 변환할 단위를 설정하는 명령어
   * 사용자가 QuickPick을 통해 단위를 선택할 수 있음
   */
  const setUnit = vscode.commands.registerCommand(
    'convertCSSUnits.setUnit',
    async () => {
      const units = ['rem', 'em', 'vw', 'vh', 'vmin', 'vmax', 'cqw', 'cqh']
      const selectedUnit = await vscode.window.showQuickPick(units, {
        placeHolder: 'Choose a unit to convert',
        canPickMany: false,
      })

      if (selectedUnit) {
        await vscode.workspace
          .getConfiguration('convertCSSUnits')
          .update('unit', selectedUnit, vscode.ConfigurationTarget.Global)
        vscode.window.showInformationMessage(`Unit set to ${selectedUnit}`)
      }
    },
  )

  /**
   * 기준 폰트 크기를 설정하는 명령어
   * 입력값 검증을 통해 유효한 값만 허용
   */
  const setBaseFontSize = vscode.commands.registerCommand(
    'convertCSSUnits.setBaseFontSize',
    async () => {
      const currentConfig = getConfiguration()

      const value = await vscode.window.showInputBox({
        prompt: 'Enter the base font size in px',
        value: currentConfig.baseFontSize.toString(),
        validateInput: value => {
          const num = parseFloat(value)

          if (isNaN(num)) {
            return 'The entered value is not a number'
          }

          if (num > 100) {
            return 'Numbers greater than 100 cannot be entered'
          }

          return null
        },
      })

      if (value) {
        await vscode.workspace
          .getConfiguration('convertCSSUnits')
          .update(
            'baseFontSize',
            parseFloat(value),
            vscode.ConfigurationTarget.Global,
          )
        vscode.window.showInformationMessage(`Base font size set to ${value}px`)
      }
    },
  )

  /**
   * 기준 너비를 설정하는 명령어
   * 입력값 검증을 통해 유효한 값만 허용
   */
  const setBaseWidth = vscode.commands.registerCommand(
    'convertCSSUnits.setBaseWidth',
    async () => {
      const currentConfig = getConfiguration()

      const value = await vscode.window.showInputBox({
        prompt: 'Enter the base width in px',
        value: currentConfig.baseWidth.toString(),
        validateInput: value => {
          const num = parseFloat(value)

          if (isNaN(num)) {
            return 'The entered value is not a number'
          }

          if (num > 10000) {
            return 'Numbers greater than 10000 cannot be entered'
          }

          return null
        },
      })

      if (value) {
        await vscode.workspace
          .getConfiguration('convertCSSUnits')
          .update(
            'baseWidth',
            parseFloat(value),
            vscode.ConfigurationTarget.Global,
          )
        vscode.window.showInformationMessage(`Base width set to ${value}px`)
      }
    },
  )

  /**
   * 기준 높이를 설정하는 명령어
   * 입력값 검증을 통해 유효한 값만 허용
   */
  const setBaseHeight = vscode.commands.registerCommand(
    'convertCSSUnits.setBaseHeight',
    async () => {
      const currentConfig = getConfiguration()

      const value = await vscode.window.showInputBox({
        prompt: 'Enter the base height in px',
        value: currentConfig.baseHeight.toString(),
        validateInput: value => {
          const num = parseFloat(value)

          if (isNaN(num)) {
            return 'The entered value is not a number'
          }

          if (num > 10000) {
            return 'Numbers greater than 10000 cannot be entered'
          }

          return null
        },
      })

      if (value) {
        await vscode.workspace
          .getConfiguration('convertCSSUnits')
          .update(
            'baseHeight',
            parseFloat(value),
            vscode.ConfigurationTarget.Global,
          )
        vscode.window.showInformationMessage(`Base height set to ${value}px`)
      }
    },
  )

  /**
   * CSS 단위 변환 명령어 (메인 기능)
   * 선택된 영역 또는 현재 라인의 모든 CSS 단위를 변환
   */
  const convertSelectionCommand = vscode.commands.registerCommand(
    'convertCSSUnits.convert',
    () => {
      const editor = vscode.window.activeTextEditor

      if (!editor) {
        vscode.window.showWarningMessage('No active editor found')
        return
      }

      const selection = editor.selection
      let text: string
      let range: vscode.Range
      let isSelection: boolean

      // 선택된 영역이 있는지 확인
      if (!selection.isEmpty) {
        // 선택된 영역이 있으면 해당 영역 사용
        text = editor.document.getText(selection)
        range = selection
        isSelection = true
      } else {
        // 선택된 영역이 없으면 현재 라인 사용
        const position = editor.selection.active
        const line = editor.document.lineAt(position.line)
        text = line.text
        range = new vscode.Range(
          new vscode.Position(position.line, 0),
          new vscode.Position(position.line, line.text.length),
        )
        isSelection = false
      }

      const config = getConfiguration()
      let convertedText = text

      // 모든 CSS 단위를 찾아서 변환
      const unitRegex = /(\d+(?:\.\d+)?)(rem|em|vw|vh|vmin|vmax|cqw|cqh|px)/g
      let match

      while ((match = unitRegex.exec(text)) !== null) {
        const fullMatch = match[0]
        const converted = convertAnyUnit(fullMatch, config)
        convertedText = convertedText.replace(fullMatch, converted)
      }

      // 변환된 내용이 원본과 다른지 확인
      if (convertedText === text) {
        const message = isSelection
          ? 'No convertible units found in the selected text'
          : 'No convertible units found in the current line'
        vscode.window.showWarningMessage(message)
        return
      }

      // 편집기에서 텍스트 교체
      editor.edit(editBuilder => {
        editBuilder.replace(range, convertedText)
      })

      const message = isSelection
        ? `The units in the selected area have been converted.`
        : `The units in the current line have been converted.`
      vscode.window.showInformationMessage(message)
    },
  )

  // 모든 명령어를 컨텍스트에 등록
  context.subscriptions.push(
    setUnit,
    setBaseFontSize,
    setBaseWidth,
    setBaseHeight,
    convertSelectionCommand,
  )
}

/**
 * VS Code 확장 비활성화 함수
 * 현재는 특별한 정리 작업이 필요하지 않음
 */
export function deactivate() {}
