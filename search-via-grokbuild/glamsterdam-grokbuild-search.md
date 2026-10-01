# Glamsterdam: practical changes for Ethereum developers and users

**Research question.** As of the research date, what practical changes should Ethereum’s Glamsterdam upgrade bring to developers and end users?

**Research date.** 30 September 2026.

**How to read this report.** Four labels are kept separate:

- **Confirmed.** A statement taken from a specification, the upgrade meta-document, or an Ethereum Foundation announcement inspected for this report.
- **Measured.** A result produced by a stated test, replay, or benchmark, with the conditions that bound it.
- **Expected.** A design goal or author description of what the mechanism is intended to do. It is not evidence that mainnet has produced that outcome.
- **Uncertain.** A conflict between sources, a value the specification itself marks as unfinished, or a date that client teams have not written into the activation table.

Glamsterdam is not activated on Ethereum mainnet. Nothing in this report is a receipt from post-upgrade mainnet usage.

## Plain-language overview

Glamsterdam is the Ethereum protocol upgrade that follows Fusaka. The name joins two forks that ship together: **Amsterdam**, the execution-layer upgrade, named for Devconnect Amsterdam in 2022, and **Gloas**, the consensus-layer upgrade, named for a star. The combined upgrade is tracked by [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773). Its mascot, under the process in EIP-8066, is a polar bear.

It is in public testing. On the Ethereum roadmap it is **in development**, with mainnet **expected in the fourth quarter of 2026 and no date set**. The only network with an agreed activation time is Sepolia: epoch 353,024, slot 11,296,768, **6 October 2026 at 13:53:36 UTC**. Hoodi and mainnet rows in EIP-7773 are empty. Fusaka is already in production, activated on 3 December 2025. The following upgrade, Hegotá, is in planning and is described on ethereum.org as expected in the second quarter of 2027, with its own date unset.

The two headliners are **enshrined proposer-builder separation** ([EIP-7732](https://eips.ethereum.org/EIPS/eip-7732)) and **block-level access lists** ([EIP-7928](https://eips.ethereum.org/EIPS/eip-7928)). Around them sits a large gas-accounting revision, several developer-experience instructions, faster validator exits, and a set of peer-to-peer changes aimed at bigger blocks and blob data.

For someone holding ETH on mainnet, the practical instruction in the Foundation’s Sepolia announcement is that this announcement does not require them to do anything. ETH does not need to be converted or “upgraded.” A node that wants to follow Sepolia, and later mainnet, must update both its execution client and its consensus client before that network’s activation. An application that hardcodes gas, assumes a 21,000-gas transfer covers every value transfer, or caps contract code at 24 KiB needs a review before mainnet activation. Many ordinary transfers to accounts that already exist stay at 21,000 execution gas. Transfers that create accounts, new storage, and large deployments become more expensive on a separate state-gas meter. A higher block capacity is something client operators can aim for after the fork. It is not a fee cut that arrives by itself, and it is not yet a committed mainnet gas limit.

## Where the upgrade stands

| Item | What the authoritative record says | Source |
| --- | --- | --- |
| Official name | Glamsterdam = Amsterdam (execution) + Gloas (consensus) | [ethereum.org Glamsterdam](https://ethereum.org/roadmap/glamsterdam/), [EF Sepolia announcement](https://blog.ethereum.org/2026/09/17/glamsterdam-testnet-announcement) |
| Tracking document | EIP-7773, *Hardfork Meta - Glamsterdam*, EIP status **Review** | [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773), raw file crawled 30 September 2026 |
| Headliners | EIP-7732 ePBS and EIP-7928 block-level access lists | EIP-7773; [Checkpoint #6, 1 October 2025](https://blog.ethereum.org/2025/10/01/checkpoint-6) |
| Stage | In development. Devnets have run, including a clean devnet-11 transition reported to All Core Devs Consensus #187. Platåberget, a short-lived public testnet, was announced on 17 August 2026 with its fork on 20 August. Sepolia is scheduled. Mainnet is not. | [Roadmap](https://ethereum.org/roadmap/), [Platåberget announcement](https://blog.ethereum.org/2026/08/17/plataberget-testnet), [Forkcast ACDC #187 notes](https://github.com/ethereum/forkcast/blob/main/public/artifacts/acdc/2026-09-17_187/key_decisions.json) |
| Sepolia | Epoch 353,024; slot 11,296,768; 6 October 2026, 13:53:36 UTC; Unix 1791294816 | EIP-7773 activation table and the EF announcement, which cites [EIPs pull request #12355](https://github.com/ethereum/EIPs/pull/12355) |
| Hoodi | Empty in EIP-7773. ACDC #187’s decision log records a **tentative** 27 October 2026, to be confirmed on 8 October if Sepolia goes smoothly. | EIP-7773; Forkcast key decisions |
| Mainnet | Empty in EIP-7773. ethereum.org: expected Q4 2026, date not confirmed. | EIP-7773; [ethereum.org](https://ethereum.org/roadmap/glamsterdam/) |
| Inclusion vocabulary | Proposed, Considered, Scheduled, Declined, and Included are per-upgrade stages defined by [EIP-7723](https://eips.ethereum.org/EIPS/eip-7723). An EIP’s own Draft/Review/Last Call status is a different fact from its place in a fork. | EIP-7723 |

**Confirmed.** EIP-7773 is in Review. Under EIP-7723, moving a meta EIP to Review is the point at which the Proposed and Declined lists should be removed. The file inspected on 30 September 2026 has a Scheduled-for-Inclusion list, a Networking list, and an Informational list. It has no Proposed, Considered, or Declined list. Scheduled for Inclusion means client teams intend to ship the EIP unless a later problem forces a removal. It does not mean the EIP has been activated. Included is the stage used only after activation.

**Uncertain.** The live [ethereum.org Glamsterdam page](https://ethereum.org/roadmap/glamsterdam/), crawled 26 September 2026, still says the meta EIP “remains in draft” and still names EIP-7610 among proposals being tested. The meta file itself is in Review and does not list EIP-7610. An ethPandaOps devnet-9 note said EIP-7610 was removed from Glamsterdam on 20 August 2026. For inclusion, this report follows the meta file crawled on the research date, not the older sentence on the overview page.

## Scheduled, supporting, and left out

### Scheduled for inclusion in EIP-7773

These are the consensus-critical protocol changes in the Scheduled list. Each EIP below was also in Review on 30 September 2026, except EIP-8246, which was in Last Call. That individual status is not the same thing as fork inclusion.

| EIP | Title | Layer |
| --- | --- | --- |
| [2780](https://eips.ethereum.org/EIPS/eip-2780) | Resource-based intrinsic transaction gas | Execution |
| [7688](https://eips.ethereum.org/EIPS/eip-7688) | Forward compatible consensus data structures | Consensus |
| [7708](https://eips.ethereum.org/EIPS/eip-7708) | ETH transfers emit a log | Execution |
| [7732](https://eips.ethereum.org/EIPS/eip-7732) | Enshrined Proposer-Builder Separation | Consensus, headliner |
| [7778](https://eips.ethereum.org/EIPS/eip-7778) | Block Gas Accounting without Refunds | Execution |
| [7843](https://eips.ethereum.org/EIPS/eip-7843) | SLOTNUM opcode | Execution |
| [7928](https://eips.ethereum.org/EIPS/eip-7928) | Block-Level Access Lists | Execution, headliner |
| [7954](https://eips.ethereum.org/EIPS/eip-7954) | Increase Maximum Contract Size | Execution |
| [7976](https://eips.ethereum.org/EIPS/eip-7976) | Increase Calldata Floor Cost | Execution |
| [7981](https://eips.ethereum.org/EIPS/eip-7981) | Increase Access List Cost | Execution |
| [7997](https://eips.ethereum.org/EIPS/eip-7997) | Deterministic Factory Contract | Execution |
| [8024](https://eips.ethereum.org/EIPS/eip-8024) | Backward compatible SWAPN, DUPN, EXCHANGE | Execution |
| [8037](https://eips.ethereum.org/EIPS/eip-8037) | State Creation Gas Cost Increase | Execution |
| [8038](https://eips.ethereum.org/EIPS/eip-8038) | State-access gas cost update | Execution |
| [8045](https://eips.ethereum.org/EIPS/eip-8045) | Exclude slashed validators from proposing | Consensus |
| [8061](https://eips.ethereum.org/EIPS/eip-8061) | Increase exit and consolidation churn | Consensus |
| [8246](https://eips.ethereum.org/EIPS/eip-8246) | Remove SELFDESTRUCT Burn | Execution |
| [8282](https://eips.ethereum.org/EIPS/eip-8282) | Builder Execution Requests | Consensus, with execution predeploys |

### Listed with the upgrade, outside the Scheduled section

EIP-7773 puts these under “Other EIPs.” The Foundation’s Sepolia post repeats them as supporting networking and informational items. They are part of the upgrade’s client work. Several of them do not change EVM consensus rules by themselves.

| EIP | Title | Role |
| --- | --- | --- |
| [7975](https://eips.ethereum.org/EIPS/eip-7975) | eth/70, partial block receipt lists | Execution networking |
| [8070](https://eips.ethereum.org/EIPS/eip-8070) | eth/72, sparse blobpool | Execution networking |
| [8136](https://eips.ethereum.org/EIPS/eip-8136) | Cell-level deltas for data-column broadcast | Consensus networking |
| [8159](https://eips.ethereum.org/EIPS/eip-8159) | eth/71, block access list exchange | Execution networking |
| [8189](https://eips.ethereum.org/EIPS/eip-8189) | snap/2, BAL-based state healing | Execution networking |
| [7904](https://eips.ethereum.org/EIPS/eip-7904) | Compute gas cost analysis | Informational |
| [8261](https://eips.ethereum.org/EIPS/eip-8261) | Gas limit schedule | Informational recommendation for consensus clients |

### Not in this upgrade

**Confirmed deferral.** Fork-choice enforced inclusion lists, FOCIL ([EIP-7805](https://eips.ethereum.org/EIPS/eip-7805)), were taken out of Glamsterdam to keep the fork smaller. The Foundation’s [Checkpoint #8 on 20 January 2026](https://blog.ethereum.org/2026/01/20/checkpoint-8) says FOCIL was moved to Considered status for the next upgrade. The [Hegotá page](https://ethereum.org/roadmap/hegota/), updated 29 September 2026, lists FOCIL as that upgrade’s scheduled headliner. Glamsterdam therefore does not add a protocol rule that forces builders to include transactions nominated by a validator committee.

**Absent from the current Scheduled list.** EIP-7610 is not in EIP-7773 as crawled on 30 September 2026. The devnet-9 note dated its removal to 20 August 2026. ethereum.org’s overview still mentions it. Treat it as not scheduled unless the meta file changes.

The current meta file does not publish the historical Declined list, because of the Review-stage rule in EIP-7723. A pull-request title from August 2025 proposed declining EIP-7792 along with scheduling the two headliners. That title alone is not a current declined-list entry. This report does not treat EIP-7792 as a documented member of today’s scope.

EOF, as a headliner, was discussed in the [EIP-7773 Magicians thread](https://ethereum-magicians.org/t/eip-7773-glamsterdam-network-upgrade-meta-thread/21195) and is not in the Scheduled list.

## Comparison of what each change does in practice

“At activation” means the rule changes for every node that follows the fork, without an application upgrade. “Needs adoption” means users notice it only after wallets, compilers, indexers, or operators change their software or configuration.

| EIP | Problem it targets | What changes at activation | Who has to act for the benefit to show up | Fee or speed effect |
| --- | --- | --- | --- | --- |
| 7732 | Proposer-builder exchange depends on trusted relays | Builders become in-protocol; payload reveal is separated from the beacon block | Validator and builder operators must run the new duties. Staking pools need new monitoring. | **Expected** longer time to validate execution. No measured mainnet throughput. |
| 7928 | Clients execute and read state serially | Each block carries an enforced access list and post-state values | Clients implement parallel reads and validation. Applications do not opt in. | **Expected** client speedup. User latency depends on gas limit, demand, and client releases. |
| 8037, 8038, 2780 | State growth and a flat 21,000 gas charge hide real costs | State creation is metered separately; state access is repriced; intrinsic gas is decomposed | Wallets and estimators must learn the new schedule. Some contracts with fixed gas will fail until edited. | Mixed. Some simple paths stay at 21,000 or fall. New state gets much more expensive. |
| 7778 | Storage-clearing refunds shrink the gas counted against the block limit | Refunds still reduce what the sender pays; they no longer free block gas | No app opt-in. Block builders and clients account differently. | Changes how full a block can get. It is not a user discount. |
| 7976, 7981 | Data-heavy transactions and access lists can force very large blocks | Higher floor on calldata; access lists pay for their bytes | Data-heavy callers pay more. Ordinary contract calls with real execution are designed to stay on the standard rate. | **Expected** smaller worst-case blocks, not a general fee cut. |
| 7954 | 24 KiB code limit splits contracts | Code limit 65,536 bytes; initcode limit 131,072 bytes | Compilers and deploy tooling must allow the larger size. Existing bytecode is valid. | Deploying more code costs more state gas under 8037. |
| 7708 | ETH moves are invisible to log indexers | Value transfers emit a log | Indexers and wallets must consume the log. The transfer itself does not wait for them. | No fee schedule of its own; the log cost is folded into EIP-2780’s value charge. |
| 7843 | Contracts cannot read the beacon slot | New `SLOTNUM` opcode `0x4b` | Only new or redeployed bytecode can call it. | None by itself. |
| 8024 | `DUP`/`SWAP` reach only depth 16 | `DUPN`, `SWAPN`, `EXCHANGE` | Compiler authors. Old contracts are unchanged. | A compiler that adopts them can avoid memory traffic. That savings is per compiled contract, not a protocol-wide discount. |
| 7997 | The well-known CREATE2 factory is an accident of history | The factory at `0x4e59…956C` is a formal requirement | Ethereum mainnet already has this contract, so activation there is specified as a no-op. Other EVM chains gain a guarantee. | None on mainnet if the account is already present. |
| 8246 | `SELFDESTRUCT` can still burn ETH | Code, storage, and nonce are still cleared; the balance stays | Contracts that used self-destruct as a burn change behavior at activation. | The destroyed account’s ETH remains. This is a behavior change, not a gas discount. |
| 7688 | Future consensus types are hard to extend | Merkleization uses progressive containers and lists; serialization stays the same | Light clients, proofs, and tooling that hash consensus objects must update. | No user-fee effect. |
| 8045 | A slashed validator can still be selected to propose | Slashed validators are skipped in proposer selection | None for honest stakers. Slashed operators simply do not propose. | No fee effect. |
| 8061 | Exit and consolidation queues are tight relative to stake | Exit churn rises and is uncapped by the activation cap; consolidation churn is separate; activation cap stays | Stakers see faster exits only when the queue was the constraint. Operators do not configure this. | **Expected** shorter exit queues and a shorter weak-subjectivity period. |
| 8282 | Builders onboard through the validator deposit path | Dedicated builder deposit and exit requests | Builder operators. Ordinary validators do not deposit as builders unless they build. | Operational, not a user gas change. |
| 7975, 8070, 8136, 8159, 8189 | Big receipts, full blob replication, and trie healing do not scale with larger blocks | New eth, snap, and column-gossip behavior | Node operators get this by updating clients. Applications do not call these protocols. | **Expected** bandwidth and sync improvements. One design calculation is below; it is not a mainnet measurement. |
| 7904 | Uncertainty about whether compute opcodes are underpriced | An empirical study recommends no compute gas increase | None. It does not change the schedule. | A measured input to the decision, not a user speedup. |
| 8261 | Clients hardcode gas-limit defaults per release | Optional epoch schedule of a default and a recommended maximum, after Gloas | Only if client teams ship a schedule and operators accept or override it. | The gas limit remains an operator choice. |

## What matters when the EIPs are taken together

The headliners are the scaling pair. EIP-7732 splits agreeing on a beacon block from validating the execution payload, so the network has more time to receive and check a larger payload. ethereum.org describes that propagation window as moving from about 2 seconds to about 9 seconds. That figure is the site’s description of the design. This report did not re-derive it from the consensus-spec constants. EIP-7928 records every account and storage location a block touches, plus the values after execution, so a client can read state from disk in parallel, validate transactions in parallel, and apply state without re-executing. Neither headliner raises the block gas limit by itself.

The gas changes are the condition attached to any higher limit. EIP-8037 prices new state by the byte and meters it on its own dimension, using a reference block gas limit of 150 million when it sets the byte price, with a stated aim of about 120 GiB of state growth per year at that reference. EIP-8038 raises the cost of touching and rewriting state that already exists, because those disk operations have become more expensive as state has grown since Berlin in 2021. EIP-2780 rebuilds the flat 21,000 intrinsic charge out of those same pieces, so a later change to account-access or state-byte prices flows into the transaction base. EIP-7778 stops refunds from making a block look smaller than the work it did. EIP-7976 and EIP-7981 raise the cost of using calldata or access lists as a way to stuff a block with bytes. EIP-7904’s measurements were used to argue that compute opcodes, unlike state, do not need a higher price to hit the study’s throughput target.

EIP-8261 then recommends that, once Gloas is active, consensus clients take their default gas-limit preference from an optional schedule. Operators may still set another value. The Sepolia client notes make the same point in operational language: Prysm 7.2.0 and Teku 26.9.1 default to a 60 million gas limit after activation, and a 200 million limit is an explicit proposer setting. On Prysm, `--suggested-gas-limit` has no effect after Gloas.

Block-level access lists are also the input to the networking follow-ons. EIP-8159 lets execution peers fetch the lists. EIP-8189 uses them in snap sync so a healing node can replay the lists instead of walking the trie. EIP-8070 samples blob data in the execution blobpool so nodes do not all download every blob. EIP-8136 sends only the missing cells of a data column. EIP-7975 pages receipt lists so a larger block’s receipts can cross the network under the usual 10 MiB message cap.

Builder registration has to match the new block pipeline. EIP-8282 gives builders their own deposit and exit requests instead of sending them through the validator deposit contract. Validator exits and consolidations move on a separate clock under EIP-8061, and a slashed validator loses proposal duty under EIP-8045.

The developer-experience EIPs ride along and do not create the capacity. Logs, `SLOTNUM`, deeper stack opcodes, a larger code limit, and a specified CREATE2 factory change what applications can do once they are rewritten or redeployed. They do not make existing transactions cheaper.

**Expected combined effect.** A node that implements the headliners and the networking EIPs can validate more gas per block without doing the work as one serial critical path, and the gas schedule charges state growth and worst-case bytes more directly so that a higher gas limit is less likely to overwhelm disks and bandwidth. **Uncertain.** Whether mainnet block capacity, fees, or confirmation time actually move depends on the gas limit operators and builders choose after activation, on demand, and on how complete the client implementations are. The upgrade does not enact a 200 million gas limit as a consensus rule.

## Mainnet, rollups, and end users

**Mainnet users.** The Foundation’s announcement says a mainnet ETH holder does not need to act for the Sepolia fork. When mainnet is later scheduled, holders still do not convert ETH. They do depend on their wallet and on the node or hosted RPC behind it. If that infrastructure estimates gas with today’s constants, a transaction can be underpriced or can revert after the fork even though the same call succeeded before it.

**Concrete mainnet paths, from the EIP-2780 reference table, assuming the companion constants now written in EIP-8037 and EIP-8038.** These are specification prices, not measured fees. A fee also depends on the base fee and the priority tip.

- A plain ETH transfer to an account that already exists remains **21,000 execution gas** and **0 state gas**. Before: 21,000. After: 21,000 execution gas.
- A self-transfer is **12,000 execution gas**. Before: it paid the flat 21,000.
- A zero-value call to an existing account, before any contract execution, is **15,000 execution gas** rather than 21,000.
- An ETH transfer that creates a new account is **21,000 execution gas plus 183,600 state gas** (120 bytes × 1,530). Before: the same transfer shape paid 21,000 and grew state without this byte charge.
- A contract-creation transaction whose target does not yet exist is **24,000 execution gas plus 183,600 state gas**, whether or not it carries value. Code bytes are then charged at 1,530 state gas per byte, plus a small execution charge for hashing.

**Wallets.** Estimation has to become two-dimensional. EIP-8037’s transaction gas ceiling for the combined dimensions is 2^32 − 1, while execution gas remains bounded by the existing per-transaction cap from EIP-7825. A tool that multiplies yesterday’s gas by a single percentage, or that assumes 21,000 covers every transfer including transfers to empty addresses, will mis-sign. A signed transaction with a gas limit that is too low cannot be edited. It has to be re-estimated and re-signed. The [repricing guide of 24 August 2026](https://blog.ethereum.org/2026/08/24/glamsterdam-repricing-testing) tells application developers to test on Platåberget and to look up affected mainnet contracts at [ethereum.github.io/repricing-impact](https://ethereum.github.io/repricing-impact/).

**Measured, with limits.** That same guide says the authors replayed historical mainnet transactions under the new schedule. The large majority were unaffected. A small set depended on assumptions the new prices break. Most of the flagged failures were fixed by raising the transaction gas limit, and some can remain broken even with a higher limit, especially where a contract forwards a fixed gas stipend. The guide does not publish the count of contracts in each bucket in the text inspected here. It also says the new schedule was derived from a performance target that supports roughly a 3× increase in base throughput. That 3× figure is the target used to set prices. It is not a measurement of mainnet transactions per second after activation.

**Conflict on fees.** The ethereum.org Glamsterdam FAQ says the upgrade will most likely reduce layer-1 fees and attributes a cheaper ETH transfer to EIP-2780. The EIP-2780 specification says the ordinary transfer to an existing account stays at 21,000 execution gas. Cheaper paths exist, such as the self-transfer. Paths that create state cost more. Calldata-heavy transactions face a higher floor under EIP-7976. A lower fee for a typical swap or transfer would require the base fee to fall because more gas is supplied than demanded. The upgrade makes a higher gas limit safer to choose. It does not set that limit, and it does not guarantee spare capacity.

**Rollups and their users.** Blob data and calldata are different resources. EIP-7976 changes the calldata floor used for worst-case execution-payload size. Rollups that still post data as calldata feel that floor. Rollups that post blobs pay the blob-gas market, which this upgrade does not reprice in the Scheduled list. EIP-8070 and EIP-8136 are expected to reduce how much bandwidth a node spends on blob propagation, which is a condition for carrying more blobs later. They do not cut a rollup user’s fee at the moment of activation. EIP-7732’s longer execution-validation window is described by ethereum.org as also leaving more room for blob data. That is an expected consequence of the timing change, not a new blob target written into EIP-7773.

FOCIL, the censorship-resistance feature most often discussed for rollup and application users who fear a builder will ignore them, is scheduled for Hegotá, not for Glamsterdam. Enshrined proposer-builder separation changes who a proposer must trust. It does not by itself force a builder to include a given transaction.

**Node and validator operators, Sepolia first.** Update both layers before 6 October 2026, 13:53:36 UTC. The Foundation’s release table, on the page whose byline reads 28 September 2026 at the 17 September URL, lists:

| Consensus client | Sepolia release in the announcement |
| --- | --- |
| Lodestar | 1.49.0 |
| Nimbus | 26.9.0 |
| Prysm | 7.2.0 |
| Teku | 26.9.1 |
| Grandine | not yet listed |
| Lighthouse | not yet listed |

| Execution client | Sepolia release in the announcement |
| --- | --- |
| Besu | 26.9.0 |
| Ethrex | 28.0.0 |
| Erigon | 3.7.0 |
| go-ethereum | 1.17.6 |
| Nethermind | 2.0.0 |
| Reth | 2.7.0 |

A validator must update the beacon node and the validator client. Builder tooling was explicitly not yet covered by that announcement. Prysm proposers who want a 200 million gas limit must set it through version 2 proposer settings or the keymanager API. Teku uses `--validators-builder-registration-default-gas-limit=200000000`. Hoodi and mainnet operators were told to wait for a separate announcement.

The bug bounty is active for the Glamsterdam specifications. Client binaries become eligible when they are added to those release tables. See the [bug bounty program](https://ethereum.org/bug-bounty/).

## Execution-layer changes

### EIP-7928, Block-Level Access Lists

**Status.** Scheduled for Inclusion. EIP status Review. Headliner chosen with EIP-7732 and recorded in the October 2025 checkpoint. Included in devnets and in the Sepolia specification list.

**Mechanism.** The block records every account and storage location accessed during execution, and the values those locations have after execution. Clients can prefetch state, validate transactions in parallel, compute state roots in parallel, and, where they implement it, update state from the list without re-execution. The list is enforced, so a block whose list does not match execution is invalid. The recipient and sender of a transaction are included even when the transaction reverts, which EIP-2780 states explicitly.

**Who notices.** Application bytecode does not call the access list. Users notice only if clients become faster or if the community later raises the gas limit. Indexers and debugging tools gain a committed state diff. Toni Wahrstätter ([@nero_eth](https://x.com/nero_eth)), an author of related BALs work, wrote on 26 September 2026 that the lists should make tracing faster, improve a future inclusion-list design, and help nodes catch up after downtime, and that snap sync version 2 replaces trie healing with the list. Those are the author’s expectations. The snap/2 mechanism itself is specified in EIP-8189. His post does not report a measured mainnet speedup. Post: [26 September 2026](https://x.com/nero_eth/status/2103806304469008385).

**Tradeoff.** The list adds bytes to every block. EIP-7976 and EIP-7981 exist partly so that other byte-heavy features do not consume the room this scaling work is trying to create. Clients that disagree about the list diverge. An August 2026 Hive pull request ([ethereum/hive#1589](https://github.com/ethereum/hive/pull/1589)) recorded that several clients produced different `blockAccessListHash` values for the same simulated block under `eth_simulateV1`. That record is a devnet-7/8 compatibility note, not the Sepolia release matrix. It is a reason to treat “parallel execution is done” as a client-quality question rather than a fact of the EIP number alone.

### EIP-2780, resource-based intrinsic transaction gas

**Status.** Scheduled. Review. Requires EIP-8037, EIP-8038, EIP-7708, and EIP-7928, among others.

**Mechanism.** The flat 21,000 is split into pieces that can be computed without reading state, plus runtime pieces that are charged only when state requires them. Intrinsic gas is the validity check. If the sender attached enough intrinsic gas but runs out during the pre-execution window, the transaction is still included, the nonce still increments, the fee is still paid, and the pre-execution state changes are reverted. Running out of gas later, inside the first EVM frame, follows the usual halt rules, with EIP-7702 delegations that already applied left in place.

The intrinsic pieces in the current text are `TX_BASE_COST` 12,000 and `TX_VALUE_COST` 6,000, plus cold account access or create-access from EIP-8038. The reference cases are the before-and-after examples in the previous section.

**Who notices.** Every wallet, paymaster, bundler, and gas estimator. Smart-contract developers notice when they hardcoded `21000`, forwarded a fixed `gas` stipend, or branched on `gasleft()`. A transfer to a new account is the sharp case: the execution charge looks familiar, and the state-gas charge of 183,600 is new.

**Benefit timing.** The new prices apply at activation. A user benefits from a cheaper path, such as a self-transfer, only if their wallet stops padding every transfer as if it were the old flat fee and if the base fee cooperates. A user creating a fresh account pays more at activation regardless of wallet adoption.

### EIP-8037, state creation gas

**Status.** Scheduled. Review.

**Mechanism.** New state is priced at `CPSB` = **1,530 gas per byte**, chosen against an average state-growth target of **120 GiB per year** at a **reference** block gas limit of **150 million**. The reference is an input to the price. It is not an activated mainnet gas limit. New account leaf: 120 bytes, so 183,600 state gas. New storage slot: 64 bytes, so 97,920 state gas. Deployed code: 1,530 state gas per byte, plus `6 × ceil(len/32)` execution gas for hashing. A new account created by `CALL` or by the remaining `SELFDESTRUCT` account-creation path moves from 25,000 gas to the byte price. Code deposit moves from 200 gas per byte on the old single meter to the byte price on the state-gas meter.

State gas and execution gas are separate. The state charge is drawn from a `state_gas_reservoir`. The `GAS` opcode reports `gas_left`, the execution side. A contract that reads `GAS` and assumes it sees every remaining resource is wrong after activation.

EIP-8037’s own text says the companion constants `COLD_ACCOUNT_ACCESS`, `ACCOUNT_WRITE`, and `CREATE_ACCESS` “are not yet final.” The numbers below are what EIP-8038 and EIP-2780 currently publish. They can still move while the EIPs stay in Review.

**Who notices.** Anyone who deploys contracts, initializes storage, uses CREATE2 factories that deploy per user, or onboards users by creating accounts. A 64 KiB contract, the new maximum under EIP-7954, would pay 65,536 × 1,530 state gas for the code bytes alone, on top of the account-creation charge. The larger code limit and the higher per-byte state price arrive together. Account-abstraction and smart-wallet deployments that create many new accounts pay the new-account charge on each new leaf.

**Benefit timing.** The higher price applies at activation. The intended benefit is room for a higher gas limit later, because state growth is no longer the cheap dimension. That room is not the same thing as a lower fee today.

### EIP-8038, state-access gas

**Status.** Scheduled. Review.

**Mechanism.** Touching state is split into access, write, and creation. Creation stays in EIP-8037. Warm versus cold rules stay as in EIP-2929. The current review table is:

| Parameter | Current value in the EIP | New value | Change stated in the EIP |
| --- | --- | --- | --- |
| Cold account access | 2,600 | 3,000 | +15% |
| Cold storage access | 2,100 | 2,100 | unchanged |
| Warm access | 100 | 100 | unchanged |
| Account write | 6,700, previously embedded | 9,000 | +34% |
| Storage write | 2,800, previously derived | 10,000 | +257% |
| Create access (account write + cold account access) | 7,000, previously derived | 12,000 | +71% |
| Storage-clear refund | 4,800 | 11,616 | +142% |

`STORAGE_WRITE` is charged once per slot that ends the transaction at a different value, and it is credited if the slot is restored, subject to the refund cap. `ACCOUNT_WRITE` is charged per writing operation, without that per-account refund, except for the special first-write rule EIP-2780 applies to EIP-7702 authorities. `EXTCODESIZE` and `EXTCODECOPY` gain a charge for a second database read.

**Who notices.** Contracts that `SSTORE` to existing slots, cold-call other contracts, or use `EXTCODESIZE` as a cheap probe. A slot write is the largest percentage move in the table. It is not a 257% increase in the price of a whole transaction, because a transaction is more than one storage write. The Foundation guide warns against scaling an old gas total by the largest line in the table.

**Security and compatibility.** Fixed stipends are the failure mode: Solidity’s 2,300-gas `transfer` and `send`, `address.call{gas: N}`, and `gasleft()` thresholds. The repricing guide’s replay is the evidence that some deployed mainnet contracts hit this and that most historical transactions did not. Presigned transactions and queued user operations with a frozen gas limit need a new signature.

### EIP-7778, block gas accounting without refunds

**Status.** Scheduled. Review.

**Mechanism.** Clearing a storage slot can still refund gas to the transaction sender. That refund no longer reduces the gas counted toward the block gas limit. A block can no longer pack extra work by relying on refunds to stay under the limit on paper.

**Who notices.** Searchers and contracts that cleared storage to stretch a block notice a tighter block. Ordinary users still receive the refund on the transaction. Block builders must account for the gross gas.

**Benefit timing.** At activation. The effect is on block packing, not a new opcode.

### EIP-7976, calldata floor

**Status.** Scheduled. Review. Requires EIP-7623.

**Mechanism.** EIP-7623 already charges a floor of 10 gas per zero byte and 40 per non-zero byte when a transaction is mostly data. EIP-7976 raises that floor to **64 gas per calldata byte for both zero and non-zero bytes**. The standard token cost for transactions that do enough EVM work stays 4 in the parameter table inspected. The author’s calculation: a 10 MiB uncompressed payload would take about 671 million gas at the new floor, against about 105 million at 10/40. The abstract states a reduction of worst-case block size of about 37%. That is a calculation inside the EIP, not a measurement of blocks on mainnet.

**Who notices.** Anyone posting large calldata with little execution: some rollup inbox transactions, inscriptions, and data-availability fallbacks. A normal token transfer or DEX swap that already spends most of its gas on execution is the case the EIP says should see minimal change.

**Benefit timing.** At activation for the payers of data-heavy transactions. The intended benefit for everyone else is headroom to raise the gas limit without accepting today’s worst-case block size.

### EIP-7981, access-list cost

**Status.** Scheduled. Review. Requires EIP-7976.

**Mechanism.** An EIP-2930 access list warms accounts and storage keys and is also a chunk of bytes in the transaction. Those bytes were not priced as data, so a caller could use them to get around the calldata floor. EIP-7981 charges the list for its byte footprint. The abstract states about a 21% further reduction in worst-case block size. The inspected specification starts from the existing 2,400 gas per address and 1,900 per storage key, and from a floor of 16 per token taken from EIP-7976, then counts address and key bytes. The percentage is the EIP’s design claim.

**Who notices.** Transactions that ship long access lists, including some bundlers and gas-heavy routers. A short access list on an ordinary call is a small absolute change. Wallets that add access lists automatically should reprice them.

### EIP-7954, maximum contract size

**Status.** Scheduled. Review.

**Mechanism.** The deployed-code limit rises from **24,576 bytes to 65,536 bytes**. The initcode limit rises from **49,152 bytes to 131,072 bytes**. Existing contracts remain valid. New contracts can be larger than the limit that has forced developers to split a contract into diamonds or several delegates.

**Who notices.** Compiler and verification tooling must accept the new ceiling. A larger deployment also pays EIP-8037’s per-byte state gas, so “the limit is higher” and “deploying the extra bytes is cheap” are different claims. The second is false under the current byte price.

**Benefit timing.** At activation for new deployments. Existing deployed code does not grow.

### EIP-7708, ETH transfers emit a log

**Status.** Scheduled. Review.

**Mechanism.** Every ETH transfer emits a log. EIP-2780 folds the cost of that log, for a top-level value transfer, into `TX_VALUE_COST` rather than adding a second charge on top of the 21,000 path. Internal value transfers from `CALL` also log.

**Who notices.** Wallets and indexers that today replay traces to discover ETH movements can subscribe to logs instead, once they implement the new event. Users of a wallet that has not shipped the change see the same transfer as before. Block explorers need a release. The log is a protocol fact at activation. The cleaner history is an application change.

**Tradeoff.** More logs mean more receipt bytes. EIP-7975 exists so receipt lists can be downloaded in pages if they outgrow a single devp2p message.

### EIP-7843, SLOTNUM

**Status.** Scheduled. Review.

**Mechanism.** Opcode `SLOTNUM` (`0x4b`) pushes the beacon slot number of the current block. Contracts that need a clock aligned to slots, rather than to the block timestamp, can read it directly.

**Who notices.** Only bytecode compiled to use the opcode. Old contracts are unchanged. Useful for protocols that key delays or randomness to slots, and for anything that wants to avoid an external oracle for the slot.

**Benefit timing.** After redeployment or a new deployment. This report did not extract a gas cost for the opcode from the truncated specification body, so no gas figure is stated.

### EIP-8024, SWAPN, DUPN, and EXCHANGE

**Status.** Scheduled. Review.

**Mechanism.** `DUP` and `SWAP` only reach stack depth 16, which pushes compilers to spill locals into memory. The new opcodes are `DUPN` (`0xe6`), `SWAPN` (`0xe7`), and `EXCHANGE` (`0xe8`), each with a one-byte immediate so the depth is visible to static analysis. `DUPN` and `SWAPN` reach depths from 17 through 235. `EXCHANGE` swaps two items inside the top 30. Each costs 3 gas, the same as today’s `DUP` and `SWAP`. The immediate encoding is constrained so that jump-destination analysis does not have to change and existing contracts keep their jump targets.

**Who notices.** Compiler authors. Solidity or Vyper users notice only after a compiler release emits the opcodes and they recompile. A contract already on chain is unaffected. Auditors gain opcodes whose operands are immediate, which the EIP chose so the stack effect stays statically visible.

**Benefit timing.** Adoption by compilers. The gas saving, where a compiler no longer writes locals to memory, is specific to the recompiled bytecode.

### EIP-7997, deterministic factory

**Status.** Scheduled. Review.

**Mechanism.** The CREATE2 factory at `0x4e59b44847b379578588920cA78FbF26c0B4956C` with a specified runtime bytecode becomes a requirement of the chain. Ethereum mainnet and many other chains already have this contract, from the keyless deployment often called Nick’s factory. The EIP says that on those chains the requirement is a no-op, and that clients must not check for the contract at the fork boundary. Chains whose gas schedule no longer allows the old fixed-price keyless transaction can only gain the address through genesis or another irregular state change, which the EIP leaves out of scope.

**Who notices.** Multi-chain deploy tooling and smart accounts that want the same address on every chain. The user-facing problem the EIP describes is a smart-account address that differs per chain and leads to lost funds. Glamsterdam does not deploy a new factory on Ethereum mainnet if the account is already there. It makes the address a standard other EVM chains can be held to.

**Security.** Deployments that read `ORIGIN`, `NUMBER`, or similar environment data can be frontrun. The EIP recommends using the factory for fully deterministic initcode.

### EIP-8246, remove the SELFDESTRUCT burn

**Status.** Scheduled. The EIP itself is in **Last Call**, which is further along than the Review status of the other scheduled EIPs. Inclusion is still Scheduled, not Included.

**Mechanism.** Accounts marked for self-destruction still have code, storage, and nonce cleared at the end of the transaction. Any remaining balance is kept. The cases in which `SELFDESTRUCT` destroyed ETH stop.

**Who notices.** A contract that used self-destruct to burn a balance will leave that ETH in place at activation. That can surprise a token or vault design that treated the burn as part of its accounting. It does not restore code that was already destroyed in earlier transactions. Applications do not need to opt in for the rule to change, which makes this one of the sharper compatibility items.

## Consensus-layer changes

### EIP-7732, enshrined proposer-builder separation

**Status.** Scheduled. Review. Consensus-layer headliner.

**Mechanism.** The execution payload is removed from the beacon block body. In its place the proposer includes a builder’s signed bid: a commitment to a block hash and a payment to the proposer. The builder reveals the payload later. A payload-timeliness committee of validators attests to whether the payload and its blob data appeared on time. Consensus validation and execution validation are separated in time as well as in logic. The protocol, rather than a relay, enforces the payment.

**Who notices.**

- **Validators and staking pools.** New duties and a new failure mode if the payload is late. The Sepolia announcement tells stakers to read their client’s ePBS instructions and to update both the beacon node and the validator client. Pools that monitored relays now need a way to monitor in-protocol bids and payload timeliness.
- **Builders and relays.** The trusted relay is no longer required for the payment exchange. Relay operators do not disappear by magic on day one. Any pipeline that still assumes the old `ExecutionPayload` inside the beacon block has to change. Builder onboarding itself moves to EIP-8282.
- **Application users.** They still send transactions to a mempool. They do not choose a builder. The design expectation is that a proposer can accept a larger payload because validation is no longer squeezed into the same short window. ethereum.org states the window change as roughly 2 seconds to roughly 9 seconds. Treat that as the site’s design description.

Alex Stokes ([@ralexstokes](https://x.com/ralexstokes)), a co-author of the meta EIP, wrote on 28 September 2026: “Glamsterdam is coming, and it is bringing blocks built without trusted relays (and a lot more).” He pointed at the Sepolia date and said Hoodi and mainnet would be announced separately. That post establishes what he claimed. The absence of trusted relays as a requirement is what EIP-7732 specifies. The post is not a measurement of relay market share after activation. Post: [28 September 2026](https://x.com/ralexstokes/status/2104719613519184019).

**Tradeoff.** The fork adds a new actor, the in-protocol builder, and a new attestation duty. Operational mistakes show up as missed payloads rather than as a familiar relay error. On a public testnet, test ETH has no meaningful cost, so builder behavior there is a weak guide to mainnet auctions. This report did not find that warning in the ACDC #187 decision list it inspected. It is a limitation of testnet evidence, not a quoted call decision.

**Benefit timing.** The protocol rules change at activation for every validator. Users see a difference only if block production actually uses the new path and if capacity or reliability changes afterward.

### EIP-8282, builder execution requests

**Status.** Scheduled. Review.

**Mechanism.** Two EIP-7685 request types, with predeploy contracts, let a builder deposit stake and later exit. The builder’s execution address can trigger a full exit. The pattern follows the withdrawal and consolidation request contracts from EIP-7002 and EIP-7251. Builders stop onboarding through the ordinary validator deposit flow.

**Who notices.** Builder operators and the client code that includes execution requests in beacon blocks. A person staking as a validator does not use these contracts unless they also run a builder. Application developers notice only if they were integrating the old “builder is just a validator” assumption.

**Benefit timing.** At activation for the registration path. A builder that never switches to the new contracts is not participating in the new pipeline.

### EIP-7688, forward-compatible consensus data structures

**Status.** Scheduled. Review.

**Mechanism.** Consensus objects adopt progressive containers (EIP-7495) and progressive lists (EIP-7916). Merkleization changes. The serialized bytes of the affected types do not. The point is that a later fork can extend these objects without breaking today’s proofs in the same way a rigid container would.

**Who notices.** Light clients, zero-knowledge circuits that hash beacon state, and any indexer that recomputes consensus Merkle roots. Nodes that only consume client APIs notice less. This is a compatibility investment. It has no fee effect and no new user transaction type.

**Benefit timing.** Proof systems must be updated to verify the new Merkleization at activation. The benefit, easier future extensions, arrives in later forks.

### EIP-8045, exclude slashed validators from proposing

**Status.** Scheduled. Review.

**Mechanism.** Proposer selection skips validators who have been slashed. A validator that is exiting honestly is not the target. A validator already marked slashed should not still win a proposal slot.

**Who notices.** Almost nobody who is following the rules. Slashed operators lose a duty they should not have kept. The network avoids a proposer who has already been penalized for equivocation or a similar offense.

**Benefit timing.** At activation, inside the consensus client. No application change.

### EIP-8061, exit and consolidation churn

**Status.** Scheduled. Review. Requires EIP-7251.

**Mechanism.** The churn quotient for activations and exits is halved, from 2^16 to 2^15, which increases churn. Exits are no longer capped by the activation cap. Activations stay capped at 256 ETH per epoch (`MAX_PER_EPOCH_ACTIVATION_CHURN_LIMIT` = 256). Consolidations get their own quotient of 2^16. The EIP’s abstract describes this as roughly doubling consolidation churn and quadrupling exit churn, while keeping exit churn proportional to stake. The weak-subjectivity calculation is adjusted. The authors’ stated balance is a weak-subjectivity period of about 7 days, which they describe as roughly half of the current period.

**Who notices.** Stakers waiting in the exit queue, and staking pools that consolidate validators toward the larger effective balances introduced earlier. Faster exits are a liquidity improvement for stakers when the queue is long. They are also a faster change in the validator set, which is why the weak-subjectivity period shrinks. Node operators who rely on a long weak-subjectivity window for checkpoint safety should read the new parameters before they treat an old checkpoint as fresh.

**Benefit timing.** At activation. No application adoption is required. The queue only shortens if people are actually exiting. The EIP does not raise the activation rate above the existing cap.

### ACDC #187 operational note that is not an EIP in the meta list

The Forkcast decision log for All Core Devs Consensus #187 on 17 September 2026 records that clients will default to QUIC at the Glamsterdam release, and that MPLEX is to be deprecated, not removed, after mainnet activation. That is a client networking decision from the call. It is not one of the EIPs in EIP-7773. Operators who pin an older transport should watch client release notes.

The same log is the source for the tentative Hoodi date of 27 October 2026. EIP-7773, crawled later, still leaves Hoodi blank. The call decision and the meta document are at different stages of commitment.

## Networking changes

These are in EIP-7773’s networking section. EIP-7975 says outright that it does not change EVM consensus rules and does not by itself require a hard fork. Clients still need a coordinated release so peers speak the same protocol version. Old peers can keep using the previous version until enough of the network has moved.

### EIP-7975, eth/70 partial receipts

**Mechanism.** `GetReceipts` gains a starting index, and `Receipts` gains a flag that the last block’s receipt list is incomplete. A client pages the rest. The motivation is the 10 MiB devp2p message cap. EIP-7825 limits one transaction’s logs to about 2 MiB (16,777,216 / 8). A whole block of such receipts at a gas limit around 83 million can exceed 10 MiB. Partial lists cannot be checked against the header root until they are complete, so the EIP adds size checks: receipt count must match the transaction count, each receipt must be no larger than the transaction gas limit divided by 8, and the downloaded total must fit the block gas limit.

**Who notices.** Node operators, during sync, if clients negotiate eth/70. Application developers notice indirectly if receipt download failures were a source of RPC gaps. Users do not call eth/70.

### EIP-8159, eth/71 block access list exchange

**Mechanism.** Adds `GetBlockAccessLists` (`0x12`) and `BlockAccessLists` (`0x13`) so peers can fetch the EIP-7928 lists for sync and for parallel execution.

**Who notices.** Clients. Without this message, a client that did not execute the block has a harder time obtaining the list it needs for the parallel path and for snap/2.

### EIP-8189, snap/2

**Mechanism.** Snap protocol version 2 removes the trie-node healing messages and adds block-access-list messages. A node that is catching up replays access lists instead of requesting trie nodes one by one. Peers that still speak snap/1 stay on the old messages. Ethrex’s 29 September 2026 release note says version negotiation is per connection, so snap/1 peers are served as before, and that the feature applies on networks where Glamsterdam is active. That is the client team’s description of its v28.0.0 release. Post: [29 September 2026](https://x.com/ethrex_client/status/2104884118555078743).

**Who notices.** Operators who sync a fresh node or heal after downtime. Vitalik Buterin wrote on 26 September 2026 that sync can already finish within half a day and that aggressive settings can bring disk use under half a terabyte, attributing that present improvement to EIP-4444 and client work, and that Glamsterdam will improve sync further, “for example Nimbus’s new sync protocol uses it.” The half-day and half-terabyte claims are about today’s chain, not about a Glamsterdam benchmark. The forward-looking sentence is his expectation. Post: [26 September 2026](https://x.com/VitalikButerin/status/2103636111260373176).

### EIP-8070, eth/72 sparse blobpool

**Mechanism.** For each new blob transaction, an execution node downloads the full blob with probability **0.15** and otherwise samples the cells that match its consensus-layer custody. The EIP’s arithmetic for average bandwidth against a full download is 0.15 + 0.85/8 ≈ 0.25, which it calls about a 4× reduction. At a mesh of 50 peers, the same text calculates a 98.6% probability that at least 3 peers hold the full payload and a 0.03% probability that none do. Builders are told to fetch full blobs for transactions they intend to include. The Engine API gains an optional custody bitfield on `engine_forkchoiceUpdatedV4` and a `engine_getBlobsV4` cell request.

**Measured input, different network.** The EIP cites Fusaka devnet 5, where average download bandwidth of a full node’s execution layer was about 4 to 5 times the consensus layer, at blob target/max of 22/33 and of 48/72. That measurement motivates the change. It is not a measurement of eth/72 on Glamsterdam mainnet, which has not activated.

**Who notices.** Node operators, as bandwidth. Rollup users notice only if the network later sustains a higher blob count and the blob base fee responds. There is no new blob target in EIP-7773.

**Status nuance.** On 9 September 2026 the ethrex client account described EIP-8070 as a draft candidate rather than scheduled for inclusion. As of the 30 September meta file it is listed under networking, not under Scheduled for Inclusion. Both can be true: it is in the upgrade’s networking section, and it is not in the consensus-critical Scheduled list. Capability negotiation is designed to leave eth/71 peers alone.

### EIP-8136, cell-level deltas

**Mechanism.** PeerDAS column gossip sends only the cells a peer does not already have, instead of the whole column. This is a consensus-layer networking optimization on top of EIP-7594. It does not change blob pricing or the blob count.

**Who notices.** Consensus clients during blob propagation. The benefit is bandwidth on the critical path of data availability, expected to matter more as columns get busier.

## Informational items

### EIP-7904, compute gas cost analysis

**Status.** Informational. Review. It recommends no schedule change.

**Measured.** The study timed EVM compute operations and precompiles on major execution clients that include the parallel-execution work enabled by EIP-7928. Using a target of **100 million gas per second**, it found that every compute operation and precompile it examined already met or beat that target under the current compute gas schedule. It therefore recommends no compute gas increase.

**Limits.** The target is chosen by the authors. The clients are the ones that already contain BAL-related parallel execution, so the result is not a statement about a client that executes serially. It does not say that mainnet blocks will process 100 million gas per second. It says these particular operations were not the bottleneck in that test setup. State access is covered by EIP-8038 instead, and the repricing guide treats state, not compute, as the dimension that had to move.

### EIP-8261, gas limit schedule

**Status.** Informational. Review. It requires EIP-7732.

**Mechanism.** After Gloas, clients should read an optional `GAS_LIMIT_SCHEDULE` from consensus `config.yaml`. Each entry starts at an epoch and supplies a default gas limit for validators who have not set their own, and a recommended maximum. Before Gloas the schedule is ignored. An operator may set a higher value. The client should warn and should still honor it. The schedule is not a consensus rule. A block is not invalid merely because it exceeds the recommendation.

**Conflict with “a 200 million floor.”** ethereum.org says state growth has to be fixed as the network “scales toward the 200M gas limit floor enabled by Glamsterdam,” while developers test at a 150 million reference for state pricing. EIP-8037’s 150 million is a pricing reference. EIP-8261 does not write 200 million into consensus. Sepolia releases default proposers to 60 million unless an operator opts into 200 million. Devnet-11 was reported, in secondary coverage of the 17 September call, to have raised its gas limit from 60 million toward 200 million as a test parameter. A testnet gas limit is not a mainnet commitment. Anyone planning capacity, fees, or hardware around “Glamsterdam means 200 million gas” is ahead of the specification.

## What people on X are saying, and what the specs allow

The posts below were read through the authenticated X API, including the full note text where the post was longer than the preview. They are evidence of what that person said on that date. They are not evidence of activation or of a measured speedup.

- **Alex Stokes, 28 September 2026**, [status/2104719613519184019](https://x.com/ralexstokes/status/2104719613519184019). Sepolia on 6 October, Hoodi and mainnet dates separate, blocks built without trusted relays. Matches EIP-7773 and EIP-7732.
- **Vitalik Buterin, 26 September 2026**, [status/2103636111260373176](https://x.com/VitalikButerin/status/2103636111260373176). Present sync improvements attributed to EIP-4444 and clients. Glamsterdam expected to improve sync further, with Nimbus given as an example. Consistent with EIP-8189’s direction. The half-day sync claim is about the chain before this fork.
- **Toni Wahrstätter, 26 September 2026**, [status/2103654571398877443](https://x.com/nero_eth/status/2103654571398877443) and [status/2103806304469008385](https://x.com/nero_eth/status/2103806304469008385). Snap version 2 uses the block access list as a state diff. He expects a significant throughput increase, faster sync, and usefulness for future zkEVMs, partial state, inclusion lists, and trie migrations. Throughput and the future uses are expectations. Inclusion lists of the FOCIL kind are Hegotá work, which is why “future-compatible” is the accurate reading of his wording.
- **ethrex, 29 September 2026**, [status/2105017899177881948](https://x.com/ethrex_client/status/2105017899177881948) and the release note linked above. Confirms the Sepolia timestamp, says mainnet and Hoodi have no Glamsterdam time, and describes snap/2 in that release. This matches the Foundation table, which lists ethrex 28.0.0.
- **ethrex, 4 September 2026**, [status/2095897077955899638](https://x.com/ethrex_client/status/2095897077955899638). A public testnet for EIP-8141, EIP-8250, EIP-8272, EIP-7805, and EIP-8369, described as built on top of Glamsterdam. Those EIP numbers are not in EIP-7773. The post is evidence of a client team testing Hegotá-era and privacy-roadmap proposals on a Glamsterdam base. It is not evidence that frame transactions or FOCIL are in Glamsterdam.

Reply threads under the Stokes and Buterin posts, in the pages retrieved, were mostly unrelated replies. They did not add a technical correction that this report could check against a spec.

## Candidates and unresolved decisions

**The Scheduled list can still change.** EIP-7723 allows a Scheduled EIP to be moved back to Considered or to Declined if client teams agree. ethereum.org says the scope is frozen and can still change before mainnet. Both statements fit a Review-stage meta EIP. “Frozen” on the website is not the Included stage.

**Mainnet timing.** Q4 2026 is the roadmap expectation. No epoch is published. Earlier public targets slipped. Checkpoint posts in July and October 2025 still spoke of 2026 without a quarter. A May 2026 secondary report said the Foundation had moved an earlier June hope toward the third quarter. ethereum.org now says the fourth quarter. The slip itself is well attested. A new date is not.

**Hoodi.** Tentative 27 October 2026 in the ACDC #187 decision log, confirmation planned for 8 October if Sepolia is clean. Not in EIP-7773 as of 30 September.

**Gas limit.** 60 million remains the default on the two Sepolia consensus clients whose notes were quoted. 150 million is EIP-8037’s pricing reference. 200 million is an operator opt-in on those Sepolia releases and a figure ethereum.org uses as a direction. It is not a scheduled consensus parameter.

**Constants still marked unfinished.** EIP-8037 says the EIP-8038 access and write constants are not yet final, even though EIP-8038 currently publishes the table above. Anyone shipping a hardcoded estimator should plan to re-read both EIPs at the Sepolia and mainnet client releases.

**Client coverage.** Grandine and Lighthouse had empty cells in the Foundation’s Sepolia table at the time the page was read. Absence from that table means this report cannot cite a version. It does not by itself mean those teams are not shipping one.

**Hegotá, so it is not confused with this fork.** [ethereum.org/roadmap/hegota](https://ethereum.org/roadmap/hegota/), 29 September 2026: in planning, expected Q2 2027, date unset. FOCIL (EIP-7805) is the scheduled headliner. A second change has been scheduled and the rest is open. The page’s inspected text describes frame transactions as part of the still-open account-abstraction discussion. ACDC #187, which is about the next fork’s early process as well as Glamsterdam’s testnets, recorded EIP-8411 as Proposed for Hegotá, EIP-8015 as Considered, and a batch of other EIPs as Declined for Hegotá, including EIP-8237, EIP-8341, EIP-8367, EIP-8321, EIP-8243, EIP-8146, and EIP-8375. Those stage changes are Hegotá process, not Glamsterdam scope.

**What this upgrade will not do.** It will not ship FOCIL, Verkle trees, or a new blob-count schedule as part of EIP-7773. It will not, by the text of EIP-2780, cut a normal ETH transfer to an existing account below 21,000 execution gas. It will not make every rollup fee fall. Secondary articles that claim a 78% gas cut, 10,000 transactions per second, or a 90% disk reduction from Verkle trees are talking about something other than the specifications inspected here. Verkle and the large disk claim showed up in secondary Hegotá commentary, not in the Glamsterdam meta EIP.

## What to do with this, by role

**Mainnet users.** Nothing for the 6 October Sepolia fork. Ignore any request to “upgrade your ETH.” When a mainnet date is announced, update wallets and hardware-wallet apps so gas estimation matches the fork, then keep using the same accounts.

**Application and smart-contract developers.** Read the [repricing guide](https://blog.ethereum.org/2026/08/24/glamsterdam-repricing-testing) and check deployed addresses in the impact tool. Search code for fixed gas stipends, `transfer`/`send`, `gasleft()`, and hardcoded 21,000. Re-test deployments, new-account funding, storage initialization, and cold external calls against a Glamsterdam client. Decide whether a larger code limit is worth the new per-byte state gas. Plan compiler support for `DUPN`/`SWAPN`/`EXCHANGE` and `SLOTNUM` as optional, after activation. If you depended on `SELFDESTRUCT` to burn ETH, revisit that design before activation. If you publish the same address on many chains, the CREATE2 factory requirement matters for those other chains more than it changes mainnet.

**Wallets, bundlers, and RPC providers.** Ship two-dimensional gas estimation. Re-sign any queued transactions whose limits were computed under the old schedule. Index EIP-7708 logs if you currently infer ETH transfers from traces. Accept code up to 65,536 bytes in verifiers and deployers.

**Infrastructure and builders.** Review ePBS payload-timeliness duties and EIP-8282 registration before you run a builder against the fork. Do not assume a relay will still be the settlement layer. Reprice access lists and large calldata.

**Node operators and validators.** For Sepolia, upgrade both clients before 6 October 2026, 13:53:36 UTC, using a release that names that activation. Set a gas-limit preference explicitly if you do not want the client default. For Hoodi and mainnet, wait for an announcement that fills EIP-7773. Budget for a shorter weak-subjectivity period under EIP-8061 once mainnet activates.

## Uncertainties

- Mainnet has no epoch. Q4 2026 is an expectation on ethereum.org, after earlier targets moved.
- Hoodi’s 27 October date is a 17 September call decision, not a filled row in EIP-7773.
- The Scheduled list is intent, not activation. The meta EIP is in Review.
- EIP-8038’s published constants and EIP-8037’s statement that those constants are not final disagree in tone. The numbers in this report are the review text of 30 September 2026.
- ethereum.org’s fee FAQ and its “200M gas limit floor” wording are stronger than EIP-2780, EIP-8261, and the Sepolia client defaults.
- ethereum.org still mentions EIP-7610 and calls the meta EIP a draft. The meta file does not list EIP-7610 and is in Review.
- The “about 9 seconds” payload window, the “about 7 days” weak-subjectivity period, the “about 37%” and “about 21%” worst-case block-size claims, and the “about 4×” blobpool bandwidth claim are design figures from ethereum.org or the EIPs. They are not post-activation measurements.
- EIP-7904’s 100 million gas per second is a benchmark target on BAL-enabled clients for compute opcodes only.
- The historical-transaction replay finds a large majority unaffected and a small set at risk. Exact counts were not in the guide text inspected here.
- Grandine and Lighthouse Sepolia versions were blank in the announcement.
- Hive’s August client-divergence notes may be stale relative to the September release candidates. They remain a reminder that simulated-block access-list hashes were not fully aligned in that test run.
- Full-archive X search was not exhausted. The pages retrieved are the relevant researcher and client posts, not a complete census of conversation.

## Provider ledger

Research date 30 September 2026. Analysis and the prose of this report were written in this harness from retrieved source text. No Exa Agent or Connect run was used. No Perplexity Ask, Reason, or Research run was used. No provider-written answer was adopted as a finding. Native web search and page readers were not used. X was not scraped.

### Octen, broad discovery and full-text reading

**Interface.** `octen.broad_search`, one call. Query, within the 500-character limit: “As of 30 September 2026, what is Ethereum's Glamsterdam upgrade: official name, current development stage, target mainnet timing, and the latest agreed scope? Which EIPs are confirmed for inclusion versus still candidates or deferred or excluded? For each confirmed consensus-layer and execution-layer EIP, what practical changes should it bring to smart-contract developers, wallets, infrastructure, node operators, and end users?” Settings: `max_queries` 8, `count` 5, `language` en, highlights on at 600 tokens, `format` markdown, timeout 180 seconds. Full page bodies were not requested on the fan-out.

**Subqueries the tool generated.** Ethereum Glamsterdam upgrade status 2026. Official name. Network upgrade roadmap 2026. EIPs list 2026. Consensus-layer EIPs. Execution-layer EIPs. Mainnet target date. Development stage September 2026.

**Contribution.** Established the public name, the Q4 2026 roadmap line, the Sepolia date on ethereum.org, and the existence of the headliners. Also returned price commentary and stale “first half of 2026” articles, which were not used as scope evidence.

**Follow-up searches.** Two `octen.search` calls, not a second broad search. One, restricted to ethereum.org, eips.ethereum.org, and blog.ethereum.org, found the repricing guide and the Platåberget announcement. The other, restricted to github.com, blog.ethereum.org, and ethereum.org, found the Forkcast ACDC #187 decision and transcript artifacts.

**Extract.** `octen.extract` with `query` left unset, `max_age_seconds` 3600, `format` markdown. Modes: `auto` for the first governance batch and the mixed blog batch, `standard` for the raw EIP files. URLs included the raw text of EIP-7723, EIP-7773, and every EIP listed in the tables above, plus the Sepolia announcement, the Glamsterdam and roadmap and Hegotá pages on ethereum.org, the 24 August 2026 repricing guide, the 17 August 2026 Platåberget post, the 20 January 2026 checkpoint, and the raw Forkcast `key_decisions.json` for ACDC #187. Raw EIP files were crawled 30 September 2026. The Sepolia blog extract shows the byline “Posted by Protocol on September 28, 2026” on the URL dated 17 September. Some internal links in that HTML still contain an unresolved `/[YYYY]/[MM]/[DD]/` template. The activation table in the article matches EIP-7773, so the schedule figures were taken from those two agreeing sources rather than from the broken link pattern.

### Exa, authoritative source discovery

**Interface.** `exa.web_search_exa`, three calls, eight results each. The live schema requires `query` and `objective`. No advanced-search filters were needed for discovery. No summaries were requested. No Agent run.

**Queries, by the documents they were aimed at.** An official Ethereum Foundation or ethereum.org page stating the fork’s name, stage, timing, and scope as of September 2026. A meta EIP or fork-scope document separating scheduled, candidate, and removed EIPs by layer. Client implementation and testing records for devnets and releases.

**Contribution.** Located EIP-7773 on eips.ethereum.org and the raw GitHub file, the ethereum.org Glamsterdam page, the Magicians meta thread, the Foundation’s Sepolia announcement, the Hive compatibility pull request, the ethPandaOps devnet-9 note, and a Geth EIP-ranking note. Those URLs were then read with Octen Extract or, where the Exa highlight already contained the schedule table, checked against the extract. The Geth ranking note is an older client preference document and was not used as the current scope. An Exa hit on a GitHub copy of the ethereum.org page still said “planned for H1 2026,” which conflicts with the live page’s Q4 2026 line. The live page was followed.

### Perplexity Search, gaps and challenges

**Interface.** `perplexity.perplexity_search` with `search_type` `fast`, four calls. `max_results` 6 or 8, `max_tokens_per_page` 1024. Fast was enough to surface the missing primary URLs. A second `web` search on the same questions was not run.

**Queries.** EIP-7773 Considered, Declined, and Proposed lists, domain-filtered to eips.ethereum.org, ethereum-magicians.org, and github.com. The repricing impact guide. Hegotá and the FOCIL deferral. Devnet-11, Platåberget, and changes after 17 September 2026, with `search_recency_filter` month.

**Contribution.** Confirmed that the public EIP-7773 page’s Scheduled list matches the raw file, and that the page does not currently render CFI or DFI lists. Surfaced Checkpoint #8, the Hegotá page, and the repricing guide URL, which were then read in full or in substantial extract. Secondary write-ups from crypto.news, datawallet, and similar sites repeated dates and added claims about builder abuse on Sepolia and about a 200 million gas floor. Where those claims were not in EIP-7773, the Foundation announcement, or the ACDC decision file, they were left out or marked as secondary. Perplexity returned snippets, not a narrative this report treats as evidence.

### X, attributed developer statements

**Interface.** xurl, OAuth2 user `[account redacted]` on the default app that `xurl auth status` marked current. Read-only. No posting.

**Recent search.** The `xurl search` shortcut searches recent posts and has no start-time flag. Requests used `-n` 10 or 15, which the help text defines as a minimum of 10 and a maximum of 100. Queries: a general Glamsterdam keyword search, `from:ralexstokes Glamsterdam -is:retweet`, and a from-filter covering `@timbeiko`, `@VitalikButerin`, `@potuz`, `@terencechain`, `@sassal0x`, and `@lightclient`. The general query’s first page was news reposts and memes dated 30 September 2026. The from-filters returned Stokes on 28 September and Buterin on 26 September.

**Full archive.** `GET /2/tweets/search/all` succeeded, so the archive role stayed on xurl rather than moving to another X client. One call used `start_time` 2026-08-15, `max_results` 10, `sort_order` relevancy, for Glamsterdam with repricing, ePBS, access lists, or builders, excluding retweets, English. A second used `start_time` 2026-07-01, `max_results` 10, `sort_order` recency, restricted to `@nero_eth`, `@ethrex_client`, `@lightclient`, `@sassal0x`, `@timbeiko`, and `@vdWijden`. Both responses included a `next_token`, so the archive was not fully paged. Returned posts in the inspected pages run from 18 August 2026 through 29 September 2026.

**Posts and threads.** Single-post reads used `tweet.fields=article,created_at,author_id,conversation_id,public_metrics,note_tweet`. Neither target post carried an X Article body. Long text was in `note_tweet`. Conversation search on the Stokes and Buterin posts retrieved reply pages dominated by unrelated replies. No article URL from X was fetched with a web reader.

**Contribution.** Attributed expectations and release notes from Stokes, Buterin, Wahrstätter, and the ethrex client account. Distinguished those statements from the specification record. Did not establish upgrade inclusion or performance numbers from a post alone.

**Access limits.** Recent search is the shortcut’s default window and, on the queries used, did not surface August discussion. Archive search worked for this app at `max_results` 10 per call and was not exhausted. Results omit posts the API does not return for this access level, including protected accounts.
