import {
  TransactionEvent,
  FindingType,
  FindingSeverity,
  Finding,
  EventType,
  Network,
  HandleTransaction,
} from 'forta-agent'

import agent from '.'
import {
  INSTADAPP_GOVERNANCE_ADDRESS,
  PROPOSAL_QUEUED_SIGNATURE,
  PROPOSAL_EXECUTED_SIGNATURE,
  PROPOSAL_CANCEL_SIGNATURE,
  TOPICS,
  generateHash,
} from './utils'

describe('Detect INSTADAPP Governance Event', () => {
  let handleTransaction: HandleTransaction

  const createTxEvent = ({
    logs,
    addresses,
    status = true,
  }: any): TransactionEvent => {
    const tx: any = {}
    const receipt: any = { logs, status }
    const block: any = {}
    const address: any = { ...addresses }

    return new TransactionEvent(
      EventType.BLOCK,
      Network.MAINNET,
      tx,
      receipt,
      [],
      address,
      block
    )
  }

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  })

  describe('Handle Transaction', () => {
    it('should return empty finding', async () => {
      const GovEvent = {
        topics: [],
        address: INSTADAPP_GOVERNANCE_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })
      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })

    it('should return empty finding - wrong address', async () => {
      const topicHash: string = generateHash(PROPOSAL_EXECUTED_SIGNATURE)

      const GovEvent = {
        topics: [topicHash],
        address: '0x01',
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })
      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })

    it('should return empty finding - empty address', async () => {
      const topicHash: string = generateHash(PROPOSAL_EXECUTED_SIGNATURE)

      const GovEvent = {
        topics: [topicHash],
        address: '',
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })
      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })



    it('should return empty finding in because of wrong address', async () => {
      const topicHash: string = generateHash(PROPOSAL_EXECUTED_SIGNATURE)

      const GovEvent = {
        topics: [topicHash],
        address: '0x02',
      }

      const anotherEvent = {
        topics: [],
        address: INSTADAPP_GOVERNANCE_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [anotherEvent, GovEvent],
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })

    describe('Successed Gov Transactions', () => {
      it('should return QUEUE Event finding', async () => {
        const topicHash: string = generateHash(PROPOSAL_QUEUED_SIGNATURE)

        const GovEvent = {
          topics: [topicHash],
          address: INSTADAPP_GOVERNANCE_ADDRESS,
        }
        const txEvent = createTxEvent({
          logs: [GovEvent],
        })

        const findings = await handleTransaction(txEvent)

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: 'INSTADAPP GOVERNANCE EVENT',
            description: `INSTADAPP ${TOPICS.QUEUE} Proposal Event is detected.`,
            alertId: 'NETHFORTA-13',
            protocol: 'INSTADAPP',
            type: FindingType.Unknown,
            severity: FindingSeverity.Info,
          }),
        ])
      })

      it('should return EXECUTE Proposal Event finding', async () => {
        const topicHash: string = generateHash(PROPOSAL_EXECUTED_SIGNATURE)

        const GovEvent = {
          topics: [topicHash],
          address: INSTADAPP_GOVERNANCE_ADDRESS,
        }
        const txEvent = createTxEvent({
          logs: [GovEvent],
        })

        const findings = await handleTransaction(txEvent)

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: 'INSTADAPP GOVERNANCE EVENT',
            description: `INSTADAPP ${TOPICS.EXECUTE} Proposal Event is detected.`,
            alertId: 'NETHFORTA-13',
            protocol: 'INSTADAPP',
            type: FindingType.Unknown,
            severity: FindingSeverity.Info,
          }),
        ])
      })

      it('should return CANCEL Proposal Event finding', async () => {
        const topicHash: string = generateHash(PROPOSAL_CANCEL_SIGNATURE)

        const GovEvent = {
          topics: [topicHash],
          address: INSTADAPP_GOVERNANCE_ADDRESS,
        }
        const txEvent = createTxEvent({
          logs: [GovEvent],
        })

        const findings = await handleTransaction(txEvent)

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: 'INSTADAPP GOVERNANCE EVENT',
            description: `INSTADAPP ${TOPICS.CANCEL} Proposal Event is detected.`,
            alertId: 'NETHFORTA-13',
            protocol: 'INSTADAPP',
            type: FindingType.Unknown,
            severity: FindingSeverity.Info,
          }),
        ])
      })
    })

    describe('Failed Gov Transactions', () => {




      it('should return Failed QUEUE Event finding', async () => {
        const topicHash: string = generateHash(PROPOSAL_QUEUED_SIGNATURE)

        const GovEvent = {
          topics: [topicHash],
          address: INSTADAPP_GOVERNANCE_ADDRESS,
        }
        const txEvent = createTxEvent({
          logs: [GovEvent],
          status: false,
        })

        const findings = await handleTransaction(txEvent)

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: 'INSTADAPP GOVERNANCE EVENT',
            description: `INSTADAPP Failed ${TOPICS.QUEUE} Proposal event is detected.`,
            alertId: 'NETHFORTA-13',
            protocol: 'INSTADAPP',
            type: FindingType.Suspicious,
            severity: FindingSeverity.High,
          }),
        ])
      })

      it('should return Failed EXECUTE Proposal Event finding', async () => {
        const topicHash: string = generateHash(PROPOSAL_EXECUTED_SIGNATURE)

        const GovEvent = {
          topics: [topicHash],
          address: INSTADAPP_GOVERNANCE_ADDRESS,
        }
        const txEvent = createTxEvent({
          logs: [GovEvent],
          status: false,
        })

        const findings = await handleTransaction(txEvent)

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: 'INSTADAPP GOVERNANCE EVENT',
            description: `INSTADAPP Failed ${TOPICS.EXECUTE} Proposal event is detected.`,
            alertId: 'NETHFORTA-13',
            protocol: 'INSTADAPP',
            type: FindingType.Suspicious,
            severity: FindingSeverity.High,
          }),
        ])
      })

      it('should return Failed CANCEL Proposal Event finding', async () => {
        const topicHash: string = generateHash(PROPOSAL_CANCEL_SIGNATURE)

        const GovEvent = {
          topics: [topicHash],
          address: INSTADAPP_GOVERNANCE_ADDRESS,
        }
        const txEvent = createTxEvent({
          logs: [GovEvent],
          status: false,
        })

        const findings = await handleTransaction(txEvent)

        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: 'INSTADAPP GOVERNANCE EVENT',
            description: `INSTADAPP Failed ${TOPICS.CANCEL} Proposal event is detected.`,
            alertId: 'NETHFORTA-13',
            protocol: 'INSTADAPP',
            type: FindingType.Suspicious,
            severity: FindingSeverity.High,
          }),
        ])
      })
    })
  })
})
