export interface ConsumerContractFile {
  contractName: string;
  consumerService: string;
  providerService: string;
  payloads: Record<string, any>[];
}