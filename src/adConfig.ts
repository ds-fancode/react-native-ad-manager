
interface IAdConfig {
    endPoint?: string
    isGAMEnabled?: boolean
}

class AdConfiguration {
    private endPoint: string
    private isGAMEnabled: boolean
    constructor() {
        this.endPoint = 'https://www.fancode.com/graphql'
        this.isGAMEnabled = true
    }
    updateValue(options: IAdConfig) {
        if(options.endPoint) {
            this.endPoint = options.endPoint
        }
        if(options.isGAMEnabled !== undefined) {
            this.isGAMEnabled = options.isGAMEnabled
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
}

export const gamADConfiguration = new AdConfiguration;