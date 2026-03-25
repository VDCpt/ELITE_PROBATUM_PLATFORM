/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — MÓDULO 1: PREVISÃO DE ÊXITO
 * ============================================================================
 */

class PredictiveLitigation {
    constructor() {
        this.model = null;
        this.trained = false;
    }
    
    async initialize() {
        // Em produção, carregar modelo ONNX treinado
        // Por ora, usar algoritmo heurístico
        console.log('[ELITE] Inicializando motor de previsão de êxito...');
        this.trained = true;
        return true;
    }
    
    predict(caseData) {
        if (!this.trained) {
            console.warn('[ELITE] Modelo não treinado');
            return { probability: 0.5, confidence: 0 };
        }
        
        const features = this.extractFeatures(caseData);
        const probability = this.calculateProbability(features);
        const confidence = this.calculateConfidence(caseData);
        
        return {
            probability,
            confidence,
            details: this.getDetailedAnalysis(features, probability)
        };
    }
    
    extractFeatures(caseData) {
        return {
            platform: caseData.platform,
            value: caseData.value,
            omissionPercentage: caseData.omissionPercentage,
            hasDAC7Discrepancy: caseData.saftVsDac7 > 0,
            yearsOfOperation: caseData.years || 1,
            hasATNotification: caseData.hasATNotification || false,
            court: caseData.court,
            judge: caseData.judge
        };
    }
    
    calculateProbability(features) {
        let prob = 0.5;
        
        // Fator plataforma (peso: 0.10)
        const platformFactors = {
            bolt: 0.08,
            uber: 0.05,
            freenow: 0.03,
            other: 0
        };
        prob += platformFactors[features.platform] || 0;
        
        // Fator percentagem de omissão (peso: 0.25)
        if (features.omissionPercentage > 80) prob += 0.20;
        else if (features.omissionPercentage > 60) prob += 0.15;
        else if (features.omissionPercentage > 40) prob += 0.10;
        else if (features.omissionPercentage > 20) prob += 0.05;
        
        // Fator valor da causa (peso: 0.10)
        if (features.value > 50000) prob += 0.08;
        else if (features.value > 15000) prob += 0.05;
        else if (features.value > 5000) prob += 0.02;
        
        // Fator DAC7 (peso: 0.10)
        if (features.hasDAC7Discrepancy) prob += 0.08;
        
        // Fator notificação AT (peso: -0.15)
        if (features.hasATNotification) prob -= 0.12;
        
        // Fator tribunal (peso: 0.05)
        const courtFactors = {
            lisboa: 0.03,
            porto: 0.05,
            braga: 0.01,
            coimbra: 0.02
        };
        prob += courtFactors[features.court] || 0;
        
        return Math.min(Math.max(prob, 0.2), 0.95);
    }
    
    calculateConfidence(caseData) {
        // Confiança baseada na quantidade de dados disponíveis
        let confidence = 0.7;
        
        if (caseData.judge) confidence += 0.1;
        if (caseData.detailedHistory) confidence += 0.1;
        if (caseData.years > 2) confidence += 0.05;
        
        return Math.min(confidence, 0.95);
    }
    
    getDetailedAnalysis(features, probability) {
        const strengths = [];
        const weaknesses = [];
        
        if (features.omissionPercentage > 60) {
            strengths.push(`Omissão de ${features.omissionPercentage}% configura fraude qualificada (Art. 104 RGIT)`);
        }
        
        if (features.hasDAC7Discrepancy) {
            strengths.push(`Divergência DAC7 evidencia subdeclaração sistemática`);
        }
        
        if (features.value > 15000) {
            strengths.push(`Valor da causa (€${features.value.toLocaleString()}) ultrapassa limiar de fraude qualificada`);
        }
        
        if (features.hasATNotification) {
            weaknesses.push(`Notificação prévia da AT pode indicar maior escrutínio`);
        }
        
        if (!features.judge) {
            weaknesses.push(`Juiz desconhecido — impossível ajustar estratégia específica`);
        }
        
        const recommendation = probability > 0.7 
            ? 'Litígio agressivo com pedido de tutela antecipada'
            : probability > 0.5
            ? 'Estratégia equilibrada com notificação extrajudicial'
            : 'Priorizar acordo ou arbitragem';
        
        return {
            strengths,
            weaknesses,
            recommendation,
            keyArguments: this.getKeyArguments(features)
        };
    }
    
    getKeyArguments(features) {
        const arguments = [
            'Art. 103.º/104.º RGIT — Fraude fiscal qualificada',
            'Art. 36.º n.º 11 CIVA — Monopólio da emissão documental',
            'Art. 125.º CPP — Admissibilidade da prova digital'
        ];
        
        if (features.hasDAC7Discrepancy) {
            arguments.push('Diretiva DAC7 (UE) 2021/514 — Obrigação de reporte');
        }
        
        if (features.omissionPercentage > 80) {
            arguments.push('Art. 344.º CC — Inversão do ónus da prova');
        }
        
        return arguments;
    }
}

// Instância global
window.PredictiveLitigation = new PredictiveLitigation();