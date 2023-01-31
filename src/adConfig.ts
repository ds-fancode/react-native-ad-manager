
interface IAdConfig {
    endPoint?: string
    isGAMEnabled?: boolean
    themeColor?: {
       loaderText?: string
    }
}

class AdConfiguration {
    private endPoint: string
    private isGAMEnabled: boolean
    private themeColor: {
        loaderText: string
     }
    constructor() {
        this.endPoint = 'https://www.fancode.com/graphql'
        this.isGAMEnabled = true
        this.themeColor = {
            loaderText: '#c8c8c8'
        }
    }
    updateValue(options: IAdConfig) {
        if(options.endPoint) {
            this.endPoint = options.endPoint
        }
        if(options.isGAMEnabled !== undefined) {
            this.isGAMEnabled = options.isGAMEnabled
        }
        if(options.themeColor) {
            Object.assign(this.themeColor, options.themeColor)
        }
    }
    setEndpoint(endpoint: string) {
        this.endPoint = endpoint
    }
    getEndpoint() {
        return this.endPoint
    }
    isGAMAdEnabled() {
        return this.isGAMEnabled
    }
    getThemeColor() {
        return this.themeColor
    }
}

export const gamADConfiguration = new AdConfiguration;