const BigNumber = require("bignumber.js");
const { Finding, FindingSeverity, FindingType } = require("forta-agent");
const {
  INST_ADDRESS,
  INST_DECIMALS,
  TRANSFER_EVENT,
} = require("./constants");

const AMOUNT_THRESHOLD = "1000000"; // 1 million

function provideHandleTransaction(amountThreshold) {
  return async function handleTransaction(txEvent) {
    const findings = [];

    // filter the transaction logs for INST Transfer events
    const InstTransferEvents = txEvent.filterLog(
      TRANSFER_EVENT,
      INST_ADDRESS
    );

    // fire alerts for transfers of large amounts
    InstTransferEvents.forEach((InstTransfer) => {
      // shift decimal places of transfer amount
      console.log(InstTransfer.value)
      // console.log("hello");
      const amount = new BigNumber(
        InstTransfer.args.value.toString()
      ).dividedBy(10 ** INST_DECIMALS)


      // const test = new BigNumber(
      //   InstTransfer.args.value.toString()
      // ).dividedBy(10 ** INST_DECIMALS)
      // console.log(test.toFixed(10));

      if (amount.isLessThan(amountThreshold)) return;

      const formattedAmount = amount.toFixed(2);
      findings.push(
        Finding.fromObject({
          name: "Large INST Transfer",
          description: `${formattedAmount} INST transferred`,
          alertId: "INST-31",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
            from: InstTransfer.args.from,
            to: InstTransfer.args.to,
            amount: formattedAmount,
          },
        })
      );
    });

    return findings;
  };
}

module.exports = {
  provideHandleTransaction,
  handleTransaction: provideHandleTransaction(AMOUNT_THRESHOLD),
};
