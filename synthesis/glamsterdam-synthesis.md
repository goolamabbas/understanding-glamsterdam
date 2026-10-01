# Glamsterdam: practical changes for Ethereum developers and users

**A synthesis of two independent research reports**

| | |
|---|---|
| **Evidence snapshot** | 30 September 2026. Nothing after that date is reflected. |
| **Synthesis prepared** | 1 October 2026 |
| **Research question** | As of the research date, what practical changes should Ethereum's Glamsterdam upgrade bring to developers and end users? |
| **Inputs** | Two research reports produced by separate agent harnesses. Each drew on the same four providers: Octen, Exa, Perplexity Search and the authenticated X API. |
| **Method** | No new web research was done for this synthesis. Where the reports agree, a claim is stated once. Where only one report covers something, it is kept. Where they conflict, the better-supported version is used and the disagreement is recorded in [Where the two source reports differ](#where-the-two-source-reports-differ). |

Glamsterdam is **not active on Ethereum mainnet**. Nothing in this document comes from post-upgrade mainnet usage.

---

## TL;DR

**What it is.** Glamsterdam is the Ethereum upgrade that follows Fusaka, which went live on 3 December 2025. It combines **Amsterdam**, the execution-layer fork named for Devconnect Amsterdam 2022, with **Gloas**, the consensus-layer fork named for a star. It is tracked by the meta-EIP [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773), which is in Review status.

**Where it stands.**
- **Sepolia:** activates **6 October 2026, 13:53:36 UTC** (epoch 353024, slot 11296768). This is the only agreed date.
- **Hoodi:** 27 October 2026 is *tentative*, to be confirmed on 8 October if Sepolia goes smoothly. The EIP-7773 activation table still leaves it blank.
- **Mainnet:** no date. The roadmap target is **Q4 2026**, after earlier targets slipped.
- Scope is effectively frozen: **18 scheduled EIPs**, 5 networking companions and 2 informational EIPs. No EIPs remain Proposed or Considered.

**The two headliners.**
- **ePBS ([EIP-7732](https://eips.ethereum.org/EIPS/eip-7732)):** the builder–proposer exchange moves into the protocol, so the payment no longer depends on a trusted relay. Execution validation is separated from consensus. ethereum.org describes the time available to propagate and validate a payload as growing from about 2 seconds to about 9.
- **Block-Level Access Lists ([EIP-7928](https://eips.ethereum.org/EIPS/eip-7928)):** each block carries an enforced map of the state it touched and the resulting values. Clients can use it to read state, validate transactions and compute roots in parallel, and to sync faster.

**The part that will break things: gas repricing.**
- New state is priced per byte (CPSB = 1,530) on a **separate state-gas meter** ([EIP-8037](https://eips.ethereum.org/EIPS/eip-8037)). Creating an account costs 183,600 state gas, a new storage slot 97,920, and deployed code 1,530 per byte.
- Access to and writes of existing state are repriced ([EIP-8038](https://eips.ethereum.org/EIPS/eip-8038)): a cold account access rises from 2,600 to 3,000, a storage write costs 10,000, and a cold storage read stays at 2,100.
- The flat 21,000 intrinsic gas is broken into components ([EIP-2780](https://eips.ethereum.org/EIPS/eip-2780)). A transfer to an **existing** account stays at 21,000. A transfer that **creates** an account costs 21,000 plus 183,600 state gas. A self-transfer costs 12,000.
- The calldata floor rises to 64 gas per byte ([EIP-7976](https://eips.ethereum.org/EIPS/eip-7976)), access-list bytes now pay for their size ([EIP-7981](https://eips.ethereum.org/EIPS/eip-7981)), and refunds no longer free up block capacity ([EIP-7778](https://eips.ethereum.org/EIPS/eip-7778)).
- Contracts at risk are those that hardcode gas, forward fixed stipends (including Solidity's 2,300-gas `transfer`/`send`), branch on `gasleft()`, or rely on presigned or queued transactions. ERC-4337 bundlers must account for state gas, which `GAS`/`gasleft()` cannot see.

**Developer features.**
- ETH transfers emit logs ([EIP-7708](https://eips.ethereum.org/EIPS/eip-7708)).
- Contract size limit rises from 24 KiB to **64 KiB**, and initcode from 48 KiB to 128 KiB ([EIP-7954](https://eips.ethereum.org/EIPS/eip-7954)). The extra bytes are expensive under state gas.
- A `SLOTNUM` opcode ([EIP-7843](https://eips.ethereum.org/EIPS/eip-7843)) and the `DUPN`/`SWAPN`/`EXCHANGE` stack opcodes ([EIP-8024](https://eips.ethereum.org/EIPS/eip-8024)).
- The well-known CREATE2 factory becomes a formal requirement ([EIP-7997](https://eips.ethereum.org/EIPS/eip-7997)). On mainnet this changes nothing, since the factory already exists.
- `SELFDESTRUCT` no longer burns ETH in the same-transaction create-and-destroy case ([EIP-8246](https://eips.ethereum.org/EIPS/eip-8246)). This matters for the OP Stack.

**Staking.**
- Exit churn is roughly 4× and consolidation churn roughly 2× ([EIP-8061](https://eips.ethereum.org/EIPS/eip-8061)). The activation cap stays at 256 ETH per epoch.
- The **weak-subjectivity period shrinks from about 15.7 days to about 7**.
- Slashed validators are no longer selected to propose ([EIP-8045](https://eips.ethereum.org/EIPS/eip-8045)).
- Builders get their own deposit and exit contracts ([EIP-8282](https://eips.ethereum.org/EIPS/eip-8282)).

**What it does *not* do.**
- It does **not** set a 200M gas limit. Sepolia clients default to 60M, and 200M must be opted into.
- It does **not** guarantee lower fees, faster slots, faster finality, less MEV or cheaper rollups.
- It does **not** include FOCIL (moved to Hegotá, expected Q2 2027), EOF, Verkle trees or a new blob schedule.
- Secondary-media claims such as "78% gas cut", "10,000 TPS" or "90% disk reduction" do not come from the specifications.

**Who must act.**
- **ETH holders:** nothing. Ignore anyone asking you to "upgrade your ETH."
- **Node operators:** upgrade **both** the execution and consensus clients before each network's activation.
- **Wallets and RPC providers:** implement two-dimensional gas estimation.
- **Contract developers:** check contracts against the [repricing-impact tool](https://ethereum.github.io/repricing-impact/) and test on a Glamsterdam network.
- **Rollups:** L1 changes do not flow automatically into your EVM. Plan your own migration, especially for `SELFDESTRUCT` semantics.

**Biggest open questions:** the Hoodi and mainnet dates; whether every client is complete; the final gas constants (EIP-8037 itself says some companion constants are "not yet final"); and the actual fee and throughput results, which depend on the gas limit operators choose after the fork.

---

## How to read this document

### Evidence labels

| Label | Meaning |
|---|---|
| **Confirmed** | Taken from a specification, the fork meta-EIP, agreed scope records, an Ethereum Foundation announcement, or client release notes that were inspected. |
| **Measured** | A result from a stated test, replay or benchmark, bounded by its conditions. It is never a post-activation mainnet measurement. |
| **Expected** | A design goal, a design calculation, or an author's or researcher's claim about what a mechanism should do. It is not evidence that mainnet has produced that outcome. |
| **Uncertain** | Sources conflict, a specification marks a value as unfinished, or a date has not been written into the activation table. |

Most statements in the per-EIP sections are **Confirmed** specification content. Labels are shown explicitly where the distinction matters.

### Fork-inclusion vocabulary

[EIP-7723](https://eips.ethereum.org/EIPS/eip-7723) defines per-upgrade stages: **Proposed** (PFI), **Considered** (CFI), **Scheduled** (SFI), **Declined** (DFI), and **Included**.

- **Scheduled** means client teams intend to ship the EIP unless an unforeseen problem forces its removal. It signals strong intent and maturity, but it can still be reversed.
- **Included** is used only after activation. No Glamsterdam EIP is Included yet.
- An EIP's *own* document status (Draft, Review, Last Call) is a separate fact from its place in a fork. A Draft EIP can still be implemented experimentally, and Review status does not mean activation.

---

## Where the upgrade stands

| Item | What the record says | Sources |
|---|---|---|
| Official name | Glamsterdam = Amsterdam (execution) + Gloas (consensus). Mascot, under the EIP-8066 process: a polar bear. | [ethereum.org](https://ethereum.org/roadmap/glamsterdam/), [EF Sepolia announcement](https://blog.ethereum.org/2026/09/17/glamsterdam-testnet-announcement) |
| Tracking document | EIP-7773, *Hardfork Meta – Glamsterdam*, status **Review** | [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773) |
| Headliners | EIP-7732 (ePBS) and EIP-7928 (BALs), recorded in Checkpoint #6 | [Checkpoint #6, 1 Oct 2025](https://blog.ethereum.org/2025/10/01/checkpoint-6) |
| Predecessor | Fusaka, activated on mainnet 3 December 2025 | ethereum.org |
| Stage | In development and public testing. Devnets have run, including a clean devnet-11 fork transition reported to All Core Devs Consensus (ACDC) #187 on 17 September 2026. The short-lived public testnet **Platåberget** was announced 17 August 2026 and forked 20 August. | [Roadmap](https://ethereum.org/roadmap/), [Platåberget announcement](https://blog.ethereum.org/2026/08/17/plataberget-testnet), [ACDC #187 key decisions](https://github.com/ethereum/forkcast/blob/main/public/artifacts/acdc/2026-09-17_187/key_decisions.json) |
| **Sepolia** | **6 October 2026, 13:53:36 UTC**; epoch 353024; slot 11296768; Unix 1791294816 | EIP-7773 activation table; EF announcement; [EIPs PR #12355](https://github.com/ethereum/EIPs/pull/12355) |
| **Hoodi** | Blank in EIP-7773. The ACDC #187 decision log and Forkcast record a **tentative 27 October 2026**, to be confirmed on 8 October if Sepolia goes smoothly. | EIP-7773; [Forkcast](https://forkcast.org/upgrade/glamsterdam/) |
| **Mainnet** | Blank in EIP-7773. ethereum.org expects Q4 2026, with no date confirmed. | [ethereum.org](https://ethereum.org/roadmap/glamsterdam/), [deployment record](https://github.com/ethereum/pm/blob/master/glamsterdam-pm.md) |
| Scope | 18 Scheduled, 5 networking and 2 informational EIPs. Forkcast shows **zero PFI and zero CFI**. | EIP-7773, Forkcast |
| Successor | **Hegotá**: in planning, expected Q2 2027, no date set. FOCIL is its scheduled headliner. | [ethereum.org/roadmap/hegota](https://ethereum.org/roadmap/hegota/) |

**Confirmed: the meta-EIP structure.** Under EIP-7723, moving a meta-EIP to Review is the point at which its Proposed and Declined lists are removed. The EIP-7773 file inspected on 30 September 2026 has a Scheduled-for-Inclusion list, a Networking list and an Informational list. It has no Proposed, Considered or Declined list. That absence does **not** mean every earlier proposal was accepted.

**Uncertain: the timing history.** Checkpoint posts in July and October 2025 spoke of "2026" without naming a quarter. A May 2026 secondary report described an earlier June hope moving toward Q3, and the roadmap now says Q4. That the date slipped is well documented. A firm new date does not exist.

**Watch the publication dates.** The EF Sepolia announcement's URL contains 17 September, but its byline reads **28 September 2026**. Some internal links in that page contain an unresolved `/[YYYY]/[MM]/[DD]/` template. The ethrex v28 release body is dated 29 September. This document uses dates from page bodies and keeps announcement dates separate from fork dates.

**Stale public material.** The live ethereum.org Glamsterdam page (crawled 26 September) still says the meta-EIP "remains in draft" and names EIP-7610 among the proposals being tested. Both statements are out of date: the meta-EIP is in Review and EIP-7610 has been removed. Older copies of that page said "H1 2026." Articles describing dozens of EIPs "still under consideration" are also stale.

---

## Scope: what is in, what is alongside, what is out

### The 18 scheduled EIPs

Each EIP's own status is **Review**, except EIP-8246, which is in **Last Call** (deadline 4 November 2026). All 18 appear in EIP-7773, the EF announcement and the devnet-11 specification.

| Layer | EIP | Problem it targets | What changes at activation | Who must act for the benefit to appear | Fee or speed effect |
|---|---|---|---|---|---|
| Consensus (headliner) | [7732](https://eips.ethereum.org/EIPS/eip-7732) ePBS | The proposer–builder exchange depends on trusted relays | Builder bids and payments move into the protocol; the payload is revealed separately; a Payload Timeliness Committee votes on it | Validators, builders, staking pools and their monitoring | **Expected:** more time to validate execution. No measured mainnet throughput. |
| Execution (headliner) | [7928](https://eips.ethereum.org/EIPS/eip-7928) BALs | Clients read and execute serially | Each block carries an enforced access list and post-state values | Client implementers. Applications do not opt in. | **Expected:** client speedups. User impact depends on the gas limit and on client quality. |
| Execution | [2780](https://eips.ethereum.org/EIPS/eip-2780) Resource-based intrinsic gas | The flat 21,000 hides real costs | The intrinsic cost is built from resource components | Wallets, estimators, relayers, account-abstraction (AA) tools | Mixed: some paths fall, existing-account transfers stay at 21,000, and account creation costs much more |
| Execution | [8037](https://eips.ethereum.org/EIPS/eip-8037) State creation gas | State growth is underpriced | A per-byte state price on a separate meter | Wallets, RPC providers, bundlers, builders, deployers | New state becomes much more expensive in gas units |
| Execution | [8038](https://eips.ethereum.org/EIPS/eip-8038) State-access gas | Disk access costs have grown since 2021 | Access, write and create are repriced | Contracts with fixed gas; estimators | Mixed. Storage writes rise sharply. |
| Execution | [7778](https://eips.ethereum.org/EIPS/eip-7778) No refunds in block accounting | Refunds let blocks pack extra work | Refunds reduce what the user pays but not the block gas count | Builders; gas telemetry | No user discount. Blocks fit differently. |
| Execution | [7976](https://eips.ethereum.org/EIPS/eip-7976) Calldata floor | Data-heavy worst-case blocks | Floor of 64 gas per byte for zero and nonzero bytes | Data-heavy senders; estimators | Data-heavy transactions cost more. **Expected** smaller worst-case blocks. |
| Execution | [7981](https://eips.ethereum.org/EIPS/eip-7981) Access-list cost | Access lists can evade data pricing | Access-list bytes pay a data surcharge | Wallets, `eth_createAccessList` users, routers | Access lists may stop being worth adding |
| Execution | [7954](https://eips.ethereum.org/EIPS/eip-7954) Contract size | The 24 KiB limit forces contracts to be split | Code limit 65,536 bytes; initcode limit 131,072 bytes | Compilers, deploy tools, verifiers, L2s | Larger code pays state gas per byte |
| Execution | [7708](https://eips.ethereum.org/EIPS/eip-7708) ETH transfer logs | ETH moves are invisible to log indexers | Qualifying transfers emit an ERC-20-shaped `Transfer` log | Indexers, exchanges, wallets | No separate fee line |
| Execution | [7843](https://eips.ethereum.org/EIPS/eip-7843) SLOTNUM | Contracts cannot read the beacon slot | Opcode `0x4b`, 2 gas | New or redeployed contracts; toolchains | None by itself |
| Execution | [8024](https://eips.ethereum.org/EIPS/eip-8024) DUPN/SWAPN/EXCHANGE | Stack access reaches only depth 16 | New stack opcodes with immediates, 3 gas each | Compiler authors | Savings per recompiled contract only |
| Execution | [7997](https://eips.ethereum.org/EIPS/eip-7997) Deterministic factory | The canonical CREATE2 factory exists only by historical accident | The factory at `0x4e59…956C` becomes a formal requirement | Multi-chain tooling; other EVM chains | None on mainnet, where the factory already exists |
| Execution | [8246](https://eips.ethereum.org/EIPS/eip-8246) Remove SELFDESTRUCT burn | Same-transaction self-destruct can still burn ETH | Code, storage and nonce are cleared but the balance is kept | Rare burn-pattern contracts; OP Stack chains | A behaviour change, not a gas change |
| Consensus | [7688](https://eips.ethereum.org/EIPS/eip-7688) Forward-compatible SSZ | Proof paths break when containers change | Progressive containers and lists; serialization unchanged | Light clients, bridges, zk circuits, proof verifiers | None |
| Consensus | [8045](https://eips.ethereum.org/EIPS/eip-8045) Exclude slashed proposers | Slashed validators can still be picked to propose | Slashed validators are filtered out of proposer selection | Consensus clients only | Fewer wasted slots after slashing events |
| Consensus | [8061](https://eips.ethereum.org/EIPS/eip-8061) Exit and consolidation churn | Exit and consolidation queues are tight | Roughly 4× exit churn and 2× consolidation churn; activation cap unchanged | Staking apps and dashboards | **Expected:** shorter exit queues, and a shorter weak-subjectivity period |
| Cross-layer | [8282](https://eips.ethereum.org/EIPS/eip-8282) Builder execution requests | Builders onboard through the validator deposit path | Dedicated builder deposit/top-up and exit contracts | Builder operators | Operational only |

### Listed alongside the upgrade (not in the Scheduled list)

EIP-7773 lists these under "Other EIPs," and the EF announcement repeats them as supporting items. They are part of the client work for the upgrade, but they should **not** be presented as seven more mandatory EVM rule changes. Each has Review status.

| Category | EIP | Main contribution | Adoption condition |
|---|---|---|---|
| EL networking | [7975](https://eips.ethereum.org/EIPS/eip-7975) eth/70 partial receipts | Receipt lists can be fetched in pages, avoiding oversized messages | Negotiated per peer |
| EL networking | [8159](https://eips.ethereum.org/EIPS/eip-8159) eth/71 BAL exchange | Historical BALs can be fetched from peers | Post-Amsterdam headers; peers retaining BALs |
| EL networking | [8070](https://eips.ethereum.org/EIPS/eip-8070) eth/72 sparse blobpool | Nodes sample custody-aligned cells instead of replicating every blob | Client and peer adoption. Builders fetch in full. |
| EL networking | [8189](https://eips.ethereum.org/EIPS/eip-8189) snap/2 | State healing uses BAL diffs instead of trie walking | Post-fork data; snap/2 implementations |
| CL networking | [8136](https://eips.ethereum.org/EIPS/eip-8136) Cell-level deltas | Only missing cells are sent, not whole columns | Both peers support the extension |
| Informational | [7904](https://eips.ethereum.org/EIPS/eip-7904) Compute gas analysis | Documents why compute repricing is unnecessary | No protocol change |
| Informational | [8261](https://eips.ethereum.org/EIPS/eip-8261) Gas limit schedule | Optional per-epoch gas-limit defaults for consensus clients | Client support and operator choice |

### Not in this upgrade (summary)

The details are in [Candidates, exclusions and unresolved scope](#candidates-exclusions-and-unresolved-scope).

- **FOCIL (EIP-7805)**: deferred. It is Hegotá's scheduled headliner.
- **EIP-7610**: removed on 20 August 2026.
- **EIP-8253**: a candidate for a later fork, not confirmed for Glamsterdam.
- **EOF (EIP-7692), delayed execution (7886), reduced block latency (7782), metered code size (7907), multidimensional gas (8011)**: all on the historical Declined list.
- **Frame transactions (EIP-8141)** and other Hegotá-era proposals: tested by some teams *on top of* Glamsterdam, but not part of it.
- **Verkle trees and a new blob-count schedule**: not in EIP-7773.

---

## Implementation and testing: what is actually established

**Devnet-11.** The [devnet-11 specification](https://notes.ethereum.org/@ethpandaops/glamsterdam-devnet-11) covers the scheduled bundle and its supporting changes. It references consensus-specs **v1.7.0-beta.0** (4 September) and execution fixtures **tests-glamsterdam-devnet@v8.1.4** (3 September). It is a happy-path fork-transition network for ecosystem testing, including Lido, Optimism and Arbitrum. Adversarial testing was assigned to devnet-8. A clean devnet-11 transition was reported at ACDC #187. Secondary coverage of that call reported devnet-11 raising its gas limit from 60M toward 200M **as a test parameter**. A testnet gas limit is not a mainnet commitment.

**Readiness snapshots are not verdicts.** The devnet-11 client-readiness table is explicitly a **8 September snapshot**, and it contains failures, incompatible branches and open fixes. Do not read it as the 30 September state. Similarly, [ethereum/hive#1589](https://github.com/ethereum/hive/pull/1589) (August 2026) recorded several clients producing **different `blockAccessListHash` values** for the same simulated block under `eth_simulateV1`. That was a devnet-7/8 compatibility note and may be stale, but it shows that "parallel execution is done" is a question of client quality, not a property of the EIP number.

**Sepolia client releases.** From the EF announcement:

| Consensus client | Sepolia release | Execution client | Sepolia release |
|---|---|---|---|
| Lodestar | 1.49.0 | Besu | 26.9.0 |
| Nimbus | 26.9.0 | ethrex | 28.0.0 |
| Prysm | 7.2.0 | Erigon | 3.7.0 |
| Teku | 26.9.1 | go-ethereum | 1.17.6 |
| Grandine | *not yet listed* | Nethermind | 2.0.0 |
| Lighthouse | *not yet listed* | Reth | 2.7.0 |

A blank row means no version can be cited. It does not by itself mean the team is not shipping. Builder tooling was explicitly not covered by the announcement.

**Release bodies inspected independently.**
- **[ethrex v28.0.0](https://github.com/lambdaclass/ethrex/releases/tag/v28.0.0)** (29 September) schedules Sepolia. It lists BAL validation fixes (around system calls, withdrawals, requests and oversized code changes), block gas enforcement, total transaction gas caps, **snap/2**, and log-index corrections.
- **[Prysm v7.2.0](https://github.com/OffchainLabs/prysm/releases/tag/v7.2.0)** schedules Sepolia. It lists progressive merkleization (EIP-7688), Gloas validator and builder interfaces, signing support, and a **builder circuit breaker** for builders who win auctions without revealing. Its notes say the Sepolia 200M gas-limit schedule entry landed after the release was cut, so the post-Gloas default stays at **60M unless explicitly configured**.

No mainnet-ready certification exists, and neither is there a complete pass matrix per EIP and per client. Being included in devnet-11 shows implementation and testing progress. It does not show universal correctness or guarantee a successful Sepolia activation.

**Bug bounty.** The [bug bounty](https://ethereum.org/bug-bounty/) is active for the Glamsterdam specifications. Client binaries become eligible once they are added to the release tables.

---

## How the changes fit together

**The scaling pair.** EIP-7732 separates agreement on a beacon block from validation of its execution payload. This gives the network more time to receive and check a larger payload; ethereum.org describes the propagation window moving from about 2 s to about 9 s (**Expected**: a design description, not re-derived from spec constants). EIP-7928 records every account and storage location a block touches, plus the post-execution values. With that, clients can prefetch from disk, validate transactions in parallel, compute roots in parallel, and apply state without re-executing. **Neither headliner raises the block gas limit.**

**Gas repricing is the price of a higher limit.** Raising the limit alone would make the storage and worst-case-byte bottlenecks worse. So:
- EIP-8037 prices new state per byte on its own meter, calibrated to about 120 GiB/year of state growth at a 150M *reference* gas limit.
- EIP-8038 raises the cost of touching and rewriting existing state, which has grown more expensive on disk since Berlin (2021).
- EIP-2780 rebuilds the 21,000 intrinsic charge from those same components, so future access or byte repricings flow through automatically.
- EIP-7778 stops refunds from making a block look smaller than the work it did.
- EIP-7976 and EIP-7981 stop calldata and access lists being used to stuff blocks with bytes.
- EIP-7904's benchmarks back the claim that compute, unlike state, does **not** need repricing to reach a 100M gas/s target.

**The gas limit remains an operator choice.** EIP-8261 recommends that consensus clients take their default gas-limit preference from an optional per-epoch schedule after Gloas, and operators can override it. The Sepolia releases show this in practice: Prysm 7.2.0 and Teku 26.9.1 default to **60M** after activation, and 200M is an explicit opt-in.

**Networking follow-ons, driven by BALs and larger blocks.**
- EIP-8159 lets peers fetch BALs.
- EIP-8189 (snap/2) replays BALs instead of healing the trie.
- EIP-8070 samples blob cells in the EL blobpool.
- EIP-8136 sends only the missing cells of a data column.
- EIP-7975 pages receipt lists so a large block's receipts fit under the 10 MiB message cap, which matters more now that EIP-7708 adds more logs.

**Staking and builder plumbing.** EIP-8282 gives builders their own registration lifecycle to fit the ePBS pipeline. EIP-8061 changes the pace of exits and consolidations, and EIP-8045 removes slashed validators from proposer selection.

**The developer features come along for the ride.** Logs, `SLOTNUM`, deeper stack opcodes, a larger code limit and a formal CREATE2 factory change what applications can do once they are rewritten or redeployed. They do not make existing transactions cheaper, and they do not create capacity. EIP-7688 and SLOTNUM together reduce how often future forks break verifiers and timing logic, after a one-time migration.

**Combined effect.**
- **Expected:** a node running the headliners and the networking EIPs can validate more gas per block without one serial critical path. The repricing makes a higher gas limit less likely to overwhelm disks and bandwidth.
- **Uncertain:** whether capacity, fees or confirmation times actually change depends on the gas limit operators and builders choose, on demand, and on how complete the clients are. The upgrade does **not** enact 200M as a consensus rule.

---

## Mainnet, rollups and end users

### Mainnet users

The EF announcement says a mainnet ETH holder does not need to do anything for the Sepolia fork. When mainnet is scheduled, holders still will not convert or "upgrade" ETH. They do depend on their wallet and on the node or RPC behind it. **If that infrastructure estimates gas with today's constants, a transaction can be underpriced, or revert after the fork, even though the same call succeeded before.**

Changes users are most likely to see, all depending on the application: better ETH deposit detection, new smart-wallet deployments, different gas estimates, and different staking queue behaviour. Lower fees, more throughput and easier syncing are **expected possibilities of uncertain size**. Faster slots, faster finality, universal MEV protection and fixed percentage fee cuts are **not** established outcomes of Glamsterdam.

### Concrete gas paths

These figures come from the EIP-2780 reference table with the companion constants currently written in EIP-8037 and EIP-8038. They are **specification prices, not measured fees**. The ETH cost also depends on the base fee and tip.

| Transaction | Before | After |
|---|---|---|
| ETH transfer to an **existing** account | 21,000 | **21,000** execution gas, 0 state gas |
| Self-transfer | 21,000 | **12,000** |
| Zero-value transaction to a distinct existing account (before any contract execution) | 21,000 | **15,000** |
| ETH transfer that **creates** an account | 21,000 (state growth unpriced) | **21,000 execution + 183,600 state** (120 bytes × 1,530) |
| Contract creation to a not-yet-existing target | — | **24,000 execution + 183,600 state**, whether or not value is sent. Code is then charged 1,530 state gas per byte plus `6 × ceil(len/32)` execution gas for hashing. |

Delegated-account (EIP-7702) execution and calldata can add more. A transaction that passes intrinsic validity but runs out of gas at runtime **is still included, still pays fees, and still increments the nonce**.

### Fee messaging conflicts with the specifications (Uncertain)

The ethereum.org Glamsterdam FAQ says the upgrade will "most likely" reduce L1 fees, and credits EIP-2780 with making ETH transfers cheaper. The EIP-2780 text keeps the ordinary existing-account transfer at 21,000. Some paths do get cheaper (self-transfers, zero-value calls). State-creating paths cost more, and calldata-heavy transactions face a higher floor.

For a typical swap or transfer to get cheaper, the base fee would have to fall because more gas is supplied than demanded. The upgrade makes a higher limit *safer to choose*. It does not choose that limit, and it does not guarantee spare capacity. The EF repricing guide says the new schedule was derived from a performance target supporting roughly **3× base throughput**. That is a pricing target, not a measured post-activation TPS figure.

ethereum.org also refers to "the 200M gas limit floor enabled by Glamsterdam." Nothing in EIP-8261, EIP-8037 or the Sepolia client defaults makes 200M a consensus floor. Anyone planning capacity, fees or hardware around "Glamsterdam means 200M gas" is ahead of the specification.

### Rollups and their users

- **L2 EVMs do not inherit L1 EVM changes.** Mainnet gas, logs, opcodes and contract limits change under the L1 fork. Rollups must update their execution and proving systems, accounting and applications on their own schedules. A 64 KiB contract that deploys on mainnet can fail on a chain that still enforces 24 KiB.
- **Calldata and blobs are different resources.** EIP-7976 directly affects rollups that post batches as calldata. Rollups that post blobs pay the blob-gas market, which no Scheduled EIP reprices. There is **no new blob target** in EIP-7773.
- **Blob propagation.** EIP-8070 and EIP-8136 are expected to reduce the bandwidth nodes spend on blobs, which is a precondition for carrying more blobs later. They do not cut rollup fees at activation. ethereum.org says ePBS's longer validation window also leaves more room for blob data. That is an expected consequence, not a new parameter.
- **Censorship resistance.** FOCIL, the feature most discussed by users worried about builders ignoring them, is in Hegotá. ePBS changes *who a proposer must trust*. It does not force a builder to include any given transaction. Optimistic-rollup withdrawal periods also depend on fraud-proof and censorship-resistance assumptions, and Glamsterdam does not shorten them.
- **SELFDESTRUCT migration.** EIP-8246 explicitly flags the OP Stack `L2ToL1MessagePasser.burn()` pattern. See [EIP-8246](#eip-8246--remove-selfdestruct-burn).

### Node and validator operators

- **Before 6 October 2026, 13:53:36 UTC**, update **both** the execution and consensus clients for Sepolia to a release that names that activation. Validators must update the beacon node, the validator client and any remote signers, and should read their client's ePBS instructions.
- **Gas-limit preference.**
  - Prysm: to use 200M, set it through version 2 proposer settings or the keymanager API. `--suggested-gas-limit` has **no effect after Gloas**.
  - Teku: `--validators-builder-registration-default-gas-limit=200000000`.
  - Otherwise both default to 60M.
- **Transport.** ACDC #187 decided that clients will default to **QUIC** from the Glamsterdam release, and that **MPLEX** will be deprecated (not removed) after mainnet activation. This is a call decision, not an EIP. Operators who pin an older transport should watch release notes.
- **Hoodi and mainnet** operators were told to wait for a separate announcement. Sepolia releases are not a mainnet instruction.
- **Weak subjectivity.** Once mainnet activates, budget for a shorter weak-subjectivity period (see EIP-8061) and keep trusted checkpoints fresh.

---

## Execution-layer changes

Every scheduled EIP below is in the agreed bundle and in the devnet-11 list. Additional implementation evidence is noted where it exists.

### EIP-7928 — Block-Level Access Lists (BALs)

**Status.** Scheduled; Review; headliner, recorded in Checkpoint #6 (October 2025).

**Mechanism.** The builder supplies an **enforced** record of every account and storage location accessed during the block, together with the post-transaction values. It is committed by a hash in the execution header, and a block whose list does not match execution is invalid. Unlike optional transaction access lists (EIP-2930), it records *actual* accesses across the whole block, including system activity. The sender and recipient are included even when a transaction reverts. Clients can prefetch disk data, validate transactions in parallel, compute state roots in parallel and, where implemented, apply state diffs without re-executing. [Specification](https://eips.ethereum.org/EIPS/eip-7928).

**Who notices.**
- **Client and infrastructure developers** must implement BAL generation, validation, storage, Engine API transport and peer retrieval.
- **Contract authors** do nothing: nobody submits a BAL manually. State dependencies still constrain parallelism. Independent transfers can be checked with parallel state access, but sequential trades against the same pool must preserve their original order.
- **Wallets** keep submitting ordinary transactions.
- **Indexers and debuggers** gain a committed state diff.
- **New nodes** can sync using recorded diffs where their trust model allows it. A header hash alone does not prove that arbitrary advertised changes are semantically valid.

**Evidence and limits.**
- **Measured (historical analysis inside the EIP):** an average compressed BAL of about **72.4 KiB** in its 60M-gas analysis, and **60–80%** of historical transactions touching disjoint storage. These are workload-specific observations, not guarantees at 200M, and they were not independently reproduced.
- **Tradeoffs:** the lists add bytes to every block, which is part of why EIP-7976 and EIP-7981 exist. Validation and retention cost resources. Spurious read entries can force useless prefetching, so bounded item counts and safe early rejection matter.
- **Consensus risk:** clients that disagree about the list will diverge. See the Hive #1589 note in [Implementation and testing](#implementation-and-testing-what-is-actually-established).

**Arrival.** BAL commitments are mandatory at activation, and the performance gain depends on client optimization. The ethrex v28 fixes, around system calls, withdrawals, requests and oversized code changes, show that the implementation details still matter. EIP-8159 and EIP-8189 deliver historical BALs and use them for sync.

**Attributed expectation.** On 26 September 2026, Toni Wahrstätter ([@nero_eth](https://x.com/nero_eth/status/2103806304469008385)), who works on BALs, said the lists should make tracing faster, help with future inclusion-list designs and help nodes catch up after downtime, and that snap/2 replaces trie healing with BALs. **Expected**, not a measured speedup.

### EIP-2780 — Resource-based intrinsic transaction gas

**Status.** Scheduled; Review. Requires EIP-8037, EIP-8038, EIP-7708 and EIP-7928, among others.

**Mechanism.** The flat 21,000 base becomes a composition of resource costs.
- **State-independent** pieces are checked when the transaction is admitted: `TX_BASE_COST` = 12,000 and `TX_VALUE_COST` = 6,000, plus cold account access or create-access from EIP-8038.
- **State-dependent** pieces, such as creating the recipient account, are charged at runtime.

This ordering stops cheap ordinary transfers from bypassing EIP-8037's new-account charge. [Specification](https://eips.ethereum.org/EIPS/eip-2780).

**Failure semantics.** Intrinsic gas is the validity check.
- A transaction that has enough intrinsic gas but runs out during the pre-execution window is **still included**: the nonce increments, the fee is paid, and the pre-execution state changes are reverted.
- Running out of gas later, inside the first EVM frame, follows the usual halt rules. EIP-7702 delegations that were already applied stay in place.

**Before and after.** See the [concrete gas paths](#concrete-gas-paths) table. Historical "reduce intrinsic gas" summaries are incomplete: existing-account transfers and fresh-account funding now differ sharply.

**Who adapts.** Wallets, RPC estimators, relayers, paymasters, bundlers and AA tools must stop assuming every plain transfer costs 21,000, and must stop assuming that an insufficient account-creation budget is rejected before inclusion. Contract developers should test funding, deployment and EIP-7702 authorizations, and search for hardcoded `21000`, fixed `gas` stipends and `gasleft()` branches. Nodes implement the new ordering and rollback rules.

**Benefit timing.** The new prices apply at activation. A user benefits from a cheaper path, such as a self-transfer, only once their wallet stops padding every transfer to the old flat fee, and only if the base fee cooperates. **A user creating a fresh account pays more at activation regardless of wallet updates.**

### EIP-8037 — State creation gas cost increase

**Status.** Scheduled; Review.

**Mechanism.** New state is priced by **cost per state byte, CPSB = 1,530**, and metered **separately** from execution.
- **Calibration:** CPSB is chosen against an average growth target of about **120 GiB/year** at a **150M reference gas limit**. That reference is an input to the price, not an activated gas limit.
- **Paying and packing:** users pay both dimensions. Block fullness and base-fee updates use the **bottleneck** dimension, not the sum.
- **Budgeting:** a reservoir model keeps a single transaction gas-limit field while separating the two budgets. State charges are drawn from a `state_gas_reservoir`.

[Specification](https://eips.ethereum.org/EIPS/eip-8037).

**Concrete charges (component costs, not whole-transaction receipts).**

| Item | State bytes | State gas | Notes |
|---|---|---|---|
| New account | 120 | **183,600** | Account creation by `CALL`, or by the remaining `SELFDESTRUCT` creation path, moves from the old 25,000 to this byte price |
| New storage slot | 64 | **97,920** | |
| Deployed code | per byte | **1,530/byte** | Plus `6 × ceil(len/32)` execution gas for hashing. Replaces the old 200 gas/byte code deposit on the single meter. |

A maximum-size 64 KiB contract pays 65,536 × 1,530 ≈ 100.3M state gas for its code bytes alone, before the account-creation charge. The EIP's illustrative ETH costs assume 0.08 gwei from a historical fee period. This document does not assume that fee at activation.

**Transaction limits.** The EIP keeps EIP-7825's per-transaction **execution** cap, while allowing a combined total gas limit of up to **2^32 − 1**. That does **not** mean a transaction can run that much EVM computation. Wallets and RPCs must support a `tx.gas` above the old execution-only cap where appropriate.

**Compatibility and security: the main hazard.**
- **`GAS`/`gasleft()` reports execution gas only**, not the reservoir. Refills can make gas-left *increase* within a frame or when child frames merge. Subtracting two readings can therefore give a negative value, revert under checked arithmetic, or wrap under unchecked arithmetic.
- **ERC-4337 bundlers and EntryPoint accounting** cannot assume that gas-left deltas capture the state charges. This was raised publicly by a contributor (see [What people on X are saying](#what-people-on-x-are-saying-and-what-the-specs-allow)), and the current EIP documents it.
- **Fixed-gas deployments and immutable gas-sensitive contracts** need attention. The EIP itself says **some deployed metering contracts cannot be fixed**.
- The September devnet changed how repayments are handled when frames merge, so current estimator and trace behaviour matters.

**Uncertain: constants not final.** EIP-8037's own text says the companion constants `COLD_ACCOUNT_ACCESS`, `ACCOUNT_WRITE` and `CREATE_ACCESS` "are not yet final," even though EIP-8038 publishes values for them. Anyone shipping a hardcoded estimator should re-read both EIPs at the Sepolia and mainnet client releases.

**Estimates and limits.**
- **Measured (cited in the EIP):** Geth state was about 390 GiB in January 2026. Daily new state rose from about 105 MiB to about 326 MiB after the gas limit moved from 30M to 60M, and the EIP notes that this behavioural response was nonlinear.
- **Expected:** growth at 200M is extrapolated from a model. It is not a guarantee or a hard cap.
- More sophisticated two-dimensional packing may favour large builders.
- State creation costs more in gas units, directly. Whether gas prices fall to offset this is uncertain.

**Who notices.** Anyone who deploys contracts, initializes storage, uses factories that deploy per user, or onboards users by creating accounts. Smart-wallet and AA deployments pay the new-account charge on every new leaf. Builders need two-resource packing, and receipt and dashboard tools need new interpretations. Node operators should get a *sustainable* resource envelope, not an assurance that the database stops growing. Dapps should measure their real workflows before redesigning.

### EIP-8038 — State-access gas cost update

**Status.** Scheduled; Review.

**Mechanism.** Touching state is split into access, write and creation. Creation stays in EIP-8037, and the warm/cold rules from EIP-2929 are unchanged. The current review table:

| Parameter | Previous | New | Change stated in the EIP |
|---|---|---|---|
| Cold account access | 2,600 | **3,000** | +15% |
| Cold storage access (cold `SLOAD`) | 2,100 | **2,100** | unchanged |
| Warm access | 100 | **100** | unchanged |
| Account write | 6,700 (previously embedded) | **9,000** | +34% |
| Storage write | 2,800 (previously derived) | **10,000** | +257% |
| Create access (account write + cold account access) | 7,000 (previously derived) | **12,000** | +71% |
| Storage-clear refund | 4,800 | **11,616** | +142% |
| Access-list prepayment | 2,400/address, 1,900/key | **2,900/address, 2,000/key** | before EIP-7981's byte surcharge |

[Specification](https://eips.ethereum.org/EIPS/eip-8038).

**Rules.** `STORAGE_WRITE` is charged once per slot that ends the transaction at a different value, and is credited if the slot is restored, subject to the refund cap. `ACCOUNT_WRITE` is charged per writing operation without that per-account refund, except for EIP-2780's special first-write rule for EIP-7702 authorities. `EXTCODESIZE` and `EXTCODECOPY` gain a charge for a second database read.

**Reading the table correctly.**
- The new write constants are not simple surcharges on top of every old composite cost.
- A 257% rise in the storage-write component is **not** a 257% rise in any whole transaction. The EF guide warns against scaling an old gas total by the largest line in the table.
- Earlier broad wording that "all SLOAD charges increase" contradicts the current table, which leaves cold storage reads at 2,100.

**Who notices and what fails.**
- **Contracts at risk:** those that `SSTORE` to existing slots, make cold calls to other contracts, or use `EXTCODESIZE` as a cheap probe. Test value-bearing calls, delegations and creation paths as well.
- **Failure mode, fixed stipends:** Solidity's 2,300-gas `transfer`/`send`, `address.call{gas: N}`, and `gasleft()` thresholds. Contracts that forward a fixed stipend can fail **even with a larger outer gas limit**.
- **Frozen gas limits:** presigned transactions and queued user operations cannot be edited. They must be re-estimated and re-signed.
- **Easy case:** apps whose frontend supplies a low gas limit can often recover by raising it.

**Measured basis and limits.** The pricing comes from synthetic blocks, Benchmarkoor timings, regression per client, conservative worst-client selection and BAL-optimized implementations, anchored at **100M gas/s**. Storage tests included a purpose-built 10 GB storage contract. This is **operation-pricing evidence under benchmark conditions**, not a sustained chain-wide rate, and it was not reproduced on representative operator hardware.

**Arrival.** Costs change at activation. The [EF historical replay](https://blog.ethereum.org/2026/08/24/glamsterdam-repricing-testing) shows there is compatibility risk. It does not show that every contract is safe or that everyone pays less. See [Migration evidence](#migration-evidence-the-repricing-replay).

### EIP-7778 — Block gas accounting without refunds

**Status.** Scheduled; Review.

**Mechanism.** Refunds for clearing storage still reduce what the **user pays**. They no longer reduce the gas counted against the **block limit**, so builders cannot use refunds to pack more gross work than the limit intends. **Measured (historical example in the EIP):** block 20878522 had 28.5M net gas plus 4.01M of refunds, which is 32.51M of gross work. This illustrates the mismatch. It is not a throughput benchmark. [Specification](https://eips.ethereum.org/EIPS/eip-7778).

**Who notices.**
- **Builders** update their packing algorithms to count gross gas.
- **Searchers** that cleared storage to stretch a block will find blocks tighter.
- **Infrastructure and telemetry** must stop treating billed gas as equal to available block capacity.
- **Users** keep their refunds.
- **Node operators** get a firmer bound on computation.

**Arrival.** At activation, closing a resource and DoS loophole. There is no guaranteed fee reduction, and refund-heavy transactions will fit into blocks differently.

### EIP-7976 — Increase calldata floor cost

**Status.** Scheduled; Review. Requires EIP-7623.

**Mechanism.** EIP-7623 already charges a floor of 10 gas per zero byte and 40 per nonzero byte to data-dominated transactions. EIP-7976 raises the floor to **64 gas per byte for both zero and nonzero bytes**. The standard token cost for transactions that do enough EVM work stays at 4 in the parameter table. The floor works as a minimum: it is not added blindly on top of every executed byte. The standalone formula keeps older base constants, so combined fork implementations must compose it with EIP-2780 and the other repricings. [Specification](https://eips.ethereum.org/EIPS/eip-7976).

**Expected (design calculation in the EIP).** A 10 MiB uncompressed payload would take about **671M gas** at the new floor, compared with about **105M** under 10/40. The abstract claims a reduction of about **37%** in worst-case block size. This is a calculation, not a mainnet measurement.

**Who notices.** Senders of large calldata with little execution: some rollup inbox transactions, inscriptions, data-availability fallbacks and some bridges. Execution-heavy transactions that already sit above the floor, such as a normal token transfer or DEX swap, should see minimal change. Wallets, SDKs, estimators and builders update their floor handling, and contract authors should compare data-encoding strategies.

**Rollups.** A rollup posting calldata to L1 pays this floor directly. Blob publication uses a different resource and fee market, so the floor does not translate into the same increase for blob-based batches.

### EIP-7981 — Increase access-list cost

**Status.** Scheduled; Review. Requires EIP-7976.

**Mechanism.** An EIP-2930 access list warms accounts and keys, but it is also a block of transaction bytes that was not priced as data, so it could be used to evade the calldata floor. EIP-7981 adds a **64 gas/byte data surcharge**: **1,280 per listed address** (20 bytes) and **2,048 per storage key** (32 bytes). This comes on top of the access prepayment and the other intrinsic and floor calculations. The EIP's standalone text starts from the older 2,400/1,900 prepayments and a floor of 16 per token. In the combined fork schedule, EIP-8038 moves the prepayments to 2,900/2,000. **Expected:** the abstract claims about a **21% further** reduction in worst-case block size. [Specification](https://eips.ethereum.org/EIPS/eip-7981).

**Who notices.** Wallets that add access lists automatically, consumers of RPC `eth_createAccessList`, and advanced transaction builders, including some bundlers and gas-heavy routers. **A list that used to save gas can now cost more than it saves**, so recompute whether it helps. Short lists on ordinary calls change little in absolute terms, and contracts need no rewrite specific to access lists. This EIP concerns *transaction* access lists. It is not a request for users to generate EIP-7928 BALs.

### EIP-7954 — Increase maximum contract size

**Status.** Scheduled; Review.

**Mechanism.** The runtime code limit rises from **24,576 to 65,536 bytes** (24 → 64 KiB), and the initcode limit from **49,152 to 131,072 bytes** (48 → 128 KiB). Existing contracts remain valid. [Specification](https://eips.ethereum.org/EIPS/eip-7954).

**Who notices.** Developers whose compiled contracts exceed 24 KiB can deploy a single contract instead of splitting it into diamonds or delegates just to fit the size limit. Compilers, deployment checks, explorers, verifiers, RPC transaction admission, audit tools and zkEVMs must all accept the new limits. Wallet deployment flows can support larger smart accounts once their tools update.

**Tradeoffs.** Being allowed to deploy larger contracts is not the same as deploying them cheaply. Under EIP-8037 the extra bytes cost 1,530 state gas each. More code also means more loading, propagation and audit burden, and splitting may still be sensible for security and maintainability. **Rollups must adopt the new limits separately.** This EIP is not the full metered-code proposal EIP-7907, which was declined.

**Arrival.** At activation, for new deployments only. Existing code does not grow.

### EIP-7708 — ETH transfers emit a log

**Status.** Scheduled; Review.

**Mechanism.** Specified **nonzero** ETH transfers **between different accounts** emit an ERC-20-shaped `Transfer` log from the system address `0xfffffffffffffffffffffffffffffffffffffffe`. This covers:
- top-level value transfers;
- `CALL` value transfers;
- `CREATE`/`CREATE2` endowments;
- `SELFDESTRUCT` transfers.

Transfers that are rolled back do not leave durable logs. Fee payments, base-fee burning and consensus withdrawals are **deliberately excluded**. For a top-level value transfer, EIP-2780 folds the log's cost into `TX_VALUE_COST` rather than adding a second charge. [Specification](https://eips.ethereum.org/EIPS/eip-7708).

**Who notices.**
- **Exchanges and explorers** can detect a smart-wallet ETH deposit from receipts instead of relying only on execution traces.
- **Wallets, indexers and accounting services** must recognize the system emitter, handle ordering correctly, and avoid double-counting transfers they already detect through traces.
- **Anyone matching on event signatures:** an ETH log is not an arbitrary token contract event just because its signature matches ERC-20 `Transfer`.
- **Tools comparing receipt or log indices, or simulated traces,** should re-test. ethrex v28 includes log-index fixes.

**Limits.** The logs are a protocol fact from activation, but simpler deposit flows need services to adopt them. They are not a complete record of every ETH balance change, and they do not backfill history. Receipt volume grows, which strengthens the case for EIP-7975's paginated receipts. The EIP defines test categories covering reverts, delegated accounts, creation and fork boundaries. No faster deposit time has been quantified.

### EIP-7843 — SLOTNUM opcode

**Status.** Scheduled; Review.

**Mechanism.** The new opcode `SLOTNUM` (`0x4b`) returns the current block's consensus slot number for **2 gas**. The slot is carried through the block header and the Engine API. Until now, contracts either derived slots from timestamps using hardcoded timing assumptions, or were supplied beacon data and proved it. [Specification](https://eips.ethereum.org/EIPS/eip-7843).

**Who notices.** Staking, oracle and scheduling contracts, and protocols that key delays or randomness to slots, can read the slot directly. Compilers, assemblers, EVM libraries, simulators and proof systems must support the opcode and the header and API extensions. Node operators need matching CL and EL versions. **Slots are not block numbers**, because slots can be missed.

**Arrival.** Only new or redeployed bytecode can use the opcode, and existing timestamp arithmetic is not rewritten. It prepares applications for possible later changes to slot duration, but it does **not** shorten slots itself. Applications must still choose sound timing and finality assumptions.

### EIP-8024 — Backward-compatible SWAPN, DUPN, EXCHANGE

**Status.** Scheduled; Review.

**Mechanism.** `DUP` and `SWAP` only reach stack depth 16, which forces compilers to spill locals into memory ("stack too deep"). The EIP adds three opcodes, each taking a one-byte immediate so that the depth is visible to static analysis, and each costing **3 gas**, the same as `DUP`/`SWAP`:
- `DUPN` (`0xe6`) and `SWAPN` (`0xe7`) reach depths 17 to 235.
- `EXCHANGE` (`0xe8`) swaps two items within the top 30.

The immediate encoding is constrained so that **JUMPDEST analysis is unchanged**, and existing contracts, including those with arbitrary embedded data, keep their valid jump targets. EOF is not required. [Specification](https://eips.ethereum.org/EIPS/eip-8024).

**Who notices.** Compiler authors. Solidity and Vyper users benefit only after recompiling with a supporting compiler. Assemblers, disassemblers, auditors, debuggers, simulators and proof systems need correct decoding and handling of invalid immediates. Deployed contracts are unaffected, and new bytecode needs compatible EVM targets on every destination chain.

**Tradeoffs.** The opcodes give compilers more options but do not remove every "stack too deep" case. Exceptional halts and stack-boundary behaviour need testing. Gas savings are specific to each recompiled contract and have not been quantified.

### EIP-7997 — Deterministic factory contract

**Status.** Scheduled; Review. Current title: "Contract" (older drafts said "Predeploy").

**Mechanism.** The existing CREATE2 factory at `0x4e59b44847b379578588920cA78FbF26c0B4956C` becomes a requirement of the chain, with prescribed runtime code and a nonzero nonce. It is the result of the keyless deployment often called "Nick's factory." The same factory, salt and initcode always give the same address.
- **Mainnet and chains that already have it:** the EIP specifies a no-op, and **clients must not check for the factory at the fork boundary**.
- **Other chains:** the factory may arrive through ordinary deployment or genesis. Chains whose gas schedule no longer allows the old fixed-price keyless transaction can only get it through genesis or an irregular state change, which the EIP leaves out of scope.

[Specification](https://eips.ethereum.org/EIPS/eip-7997).

**Who notices.** Multi-chain deploy tooling and smart-wallet teams, who can reduce per-chain address configuration. The problem the EIP describes is a smart-account address that differs between chains and leads to lost funds. On mainnet the benefit is a durable guarantee. For other EVM chains it is a standard they can be held to.

**Security and migration.**
- The state repricing can make old **presigned factory deployment transactions fail** on new networks.
- A shared address does not mean shared balances, ownership configuration or safe cross-chain signing, and existing accounts at different addresses do not merge.
- Deployments whose initcode reads `ORIGIN`, `NUMBER` or similar environment data **can be front-run**. The factory should be used with fully deterministic initcode.
- Rollups must adopt the factory requirement independently.

### EIP-8246 — Remove SELFDESTRUCT burn

**Status.** Scheduled. The EIP document is in **Last Call**, with a deadline of **4 November 2026**. That maturity milestone is separate from scheduled inclusion and from activation timing.

**Mechanism.** This removes the remaining cases where ETH is burned when a contract is **created and destroyed in the same transaction**. At finalization, marked accounts have their code and storage cleared and their nonce reset, but **keep any balance**. SELFDESTRUCT behaviour for pre-existing contracts under EIP-6780 is unchanged. This has nothing to do with EIP-1559 fee burning. [Specification](https://eips.ethereum.org/EIPS/eip-8246).

**Who notices.**
- **Applications that rely on the pattern.** Mainnet applications that use same-transaction self-burn must stop assuming the ETH disappears. The rule changes with no opt-in, so any contract that depends on it changes behaviour at activation.
- **Accounting.** Together with ETH transfer logs, accounting and indexing become simpler.
- **Measured (historical replay in the EIP):** replaying up to about block 25M found only **two post-Cancun burns** of this kind and zero burns at finalization. That is a historical sample, not proof that nothing depends on it.

**Security.** A funded, code-free, zero-nonce account can again become a valid CREATE2 target. With a permissionless factory and public deployment inputs, **someone may redeploy code at that address and take the preserved balance**. Preserved balances can also simply end up locked.

**Rollup migration.** The EIP explicitly flags the OP Stack's **`L2ToL1MessagePasser.burn()`**, which relies on a self-destructing constructor to remove withdrawn L2 ETH. Chains that inherit that pattern need their own migration plan before adopting these semantics. Activation on L1 does not quietly change any rollup's EVM.

---

## Consensus-layer changes

### EIP-7732 — Enshrined Proposer-Builder Separation (ePBS)

**Status.** Scheduled; Review; consensus-layer headliner.

**Mechanism.** Today, proposers usually rely on relay middleware to exchange a builder's block for payment. ePBS moves the execution payload out of the beacon block body.
1. The proposer includes a builder's **signed bid**: a commitment to a block hash plus a payment to the proposer.
2. The builder **reveals the payload later**.
3. A **Payload Timeliness Committee (PTC)** of validators votes on whether the payload and its blob data arrived on time.

Consensus agreement and execution validation are separated in time as well as in logic. Builder balances and proposer payments live in consensus, so **the protocol enforces the payment**, not a relay. Builders may still use trusted off-protocol payment arrangements, and ePBS does not require every service in the supply chain to disappear. [Specification](https://eips.ethereum.org/EIPS/eip-7732).

**Who notices.**
- **Validators and staking pools.** They take on new PTC duties and a new failure mode when payloads are late. Beacon nodes, validator clients, signers, proposer preferences and builder integrations all need updating. Pools that monitored relays must now monitor in-protocol bids, payload timeliness, non-revealed payloads and invalid payloads.
- **Builders and relays.** They need the new bid, funding and reveal lifecycle, and builder onboarding moves to EIP-8282. A trusted relay is no longer *required* for the payment exchange, but relays do not vanish on day one. Any pipeline that assumes an `ExecutionPayload` inside the beacon block must change.
- **RPC and application infrastructure.** Review any assumption that a consensus head always means transaction execution is immediately usable.
- **Contracts and end users.** No opt-in. Users still send transactions to a mempool and do not choose a builder.

**Expected benefits and their limits.** The main expected benefit is a network that can carry and validate **larger payloads**, because validation is no longer squeezed into the same short window (ethereum.org: about 2 s → about 9 s). That is a timing explanation, **not** a nine-second confirmation guarantee or a measured throughput multiplier. Nothing establishes less sandwiching, faster finality or a numerical reduction in MEV. The realized gains depend on capacity increases and client optimization.

**Security and tradeoffs.**
- **Free-option risk:** the specification notes that a builder may profit from withholding a payload it committed to, causing missed execution.
- **Builder exposure:** builders are exposed to colluding proposers or attesters and to adversarial PTC members.
- **Complexity:** more actors, partial blocks and new failure modes make implementation substantially harder. Operational mistakes show up as missed payloads rather than familiar relay errors.
- **Mitigation:** Prysm 7.2.0 adds a circuit breaker for builders who win auctions but do not reveal.
- **Fast confirmation (Expected):** researcher Barnabé Monnot expects ePBS to raise best-case **Fast Confirmation Rule latency from roughly 13 s to roughly 24 s**, with optimization work under way. This is an author-reported design estimate, not an economic-finality figure, and it was not reproduced.
- **Testnet evidence is weak here.** Test ETH has no real value, so builder behaviour on public testnets says little about mainnet auctions.

**Attributed statement.** On 28 September 2026, Alex Stokes ([@ralexstokes](https://x.com/ralexstokes/status/2104719613519184019)), a co-author of the meta-EIP, wrote: "Glamsterdam is coming, and it is bringing blocks built without trusted relays (and a lot more)." That matches what EIP-7732 specifies. It is not a measurement of relay market share after activation.

**Benefit timing.** The protocol rules change for every validator at activation. Users see a difference only if block production actually uses the new path *and* capacity or reliability changes afterwards.

### EIP-8282 — Builder execution requests (cross-layer)

**Status.** Scheduled; Review.

**Mechanism.** Two EIP-7685 request types, with dedicated execution-layer contracts, handle builder **deposits/top-ups** and **exits**. They follow the pattern of the EIP-7002 withdrawal and EIP-7251 consolidation request contracts. Requests are queued, drained by system calls and committed through the EIP-7685 request bus. Builder and validator registries are keyed separately, so builders stop onboarding through the validator deposit flow. **The builder's execution address can trigger a full exit**, giving a path that does not depend on the hot BLS bidding key. [Specification](https://eips.ethereum.org/EIPS/eip-8282).

**Who notices.** Builder operators and funding tools must use the dedicated contracts with the correct byte encodings, signing domains and request fees. Deposits carry a **proof of possession**, and **a wrong first-deposit signature can forfeit the stake**. Ordinary validators and general dapps are unaffected unless they run or manage builders. End users benefit indirectly from a safer builder lifecycle with explicit bounds.

**Arrival and security.**
- **Pre-fork deployment is required.** The current specification needs deployment transactions *before* the fork, and makes post-fork blocks invalid if the contracts are missing. Addresses depend on the final reference bytecode, so integrations must follow the finalized deployment guidance.
- **Bounded processing.** Each block dequeues at most **64 deposits and 16 exits**, and fees that respond to demand discourage queue spam.
- **Finality still applies.** Skipping validator activation churn does not skip the builder's finality-based activation condition.
- **Audit gap.** Devnet-11 includes the request contracts, but their deployed code and addresses were not independently audited.

### EIP-7688 — Forward-compatible consensus data structures

**Status.** Scheduled; Review.

**Mechanism.** Consensus objects use SSZ Merkle trees, which let contracts and off-chain verifiers prove individual facts about beacon state. Today, adding unrelated fields or changing list capacities can change proof paths. This EIP adopts **ProgressiveContainer** (EIP-7495) and **progressive lists and bitlists** (EIP-7916) for objects that evolve, with stable field indices. **Serialization is unchanged. Merkleization changes.** Structures stay immutable where converting them would add overhead or disruption. [Specification](https://eips.ethereum.org/EIPS/eip-7688).

**Who notices.** Light clients, bridges, hardware-wallet verifiers, zk circuits that hash beacon state, indexers that recompute consensus roots, and staking applications that prove facts such as "validator X is not slashed." Each must **migrate its verifier once**, and must tell pre-fork proof shapes apart from post-fork ones. Historical proofs still need the historical scheme. After that, they should need fewer updates when unrelated fields change in later compatible forks. Nodes get the change through consensus-client upgrades; Prysm 7.2.0 implements progressive merkleization.

**Tradeoffs.** This is a one-time breaking change to proofs, made to reduce future maintenance. Stable indices require strict rules: fields are only appended, and a removed field is never reused for a different type. Progressive structures do **not** mean unlimited message sizes, so runtime and message limits are still essential. There is no fee effect and no measured user-facing speedup.

### EIP-8045 — Exclude slashed validators from proposing

**Status.** Scheduled; Review.

**Mechanism.** Slashed validators can currently still be selected to propose, even though any block they produce is invalid. This causes avoidable missed slots, especially after mass slashings. Proposer selection now filters to active validators that are not slashed. Honest exiting validators are not affected. The existing proposer lookahead prevents a later slashing from reshuffling a schedule that has already been computed. [Specification](https://eips.ethereum.org/EIPS/eip-8045).

**Who notices.** Consensus clients and validator-duty infrastructure. Applications and wallets are not affected. While the network recovers from a large slashing event, fewer future slots go to validators that are known to be unable to produce valid blocks.

**Limits.** The benefit only appears when slashings happen. It does not fix outages and does not repair a lookahead window that is already frozen. Selection among eligible validators is still random and weighted by balance. No number of avoided missed slots is claimed. The specification calls for tests covering non-selection, a complete lookahead despite slashings, and preservation of the existing lookahead.

### EIP-8061 — Increase exit and consolidation churn

**Status.** Scheduled; Review. Requires EIP-7251.

**Mechanism.** Exit congestion can leave stakers waiting a long time, and slow consolidations delay reducing the number of validator entries. The EIP:
- restores **exits proportional to stake** that are no longer capped by the activation cap;
- **halves the churn quotient for exits** from 2^16 to **2^15 (32,768)**;
- gives consolidations their own independent quotient of **2^16 (65,536)**;
- keeps activations **capped at 256 ETH per epoch** (`MAX_PER_EPOCH_ACTIVATION_CHURN_LIMIT`).

[Specification](https://eips.ethereum.org/EIPS/eip-8061).

**Expected (parameter comparison in the EIP).** About **4× exit churn** and about **2× consolidation churn** compared with the previous cap, depending on total stake. These are comparisons of parameters, not measured reductions in any individual's waiting time.

**Security: the weak-subjectivity period.** The EIP's calculation shortens the estimated safe checkpoint window **from about 15.7 days to about 7 days**, under the stated assumptions. Faster exits mean the validator set can change faster. Operators, checkpoint services and nodes that have been offline for a long time must take the shorter window seriously, and should not treat an old checkpoint as fresh.

**Who notices.**
- **Stakers in a congested exit queue** may get an earlier exit, but cannot assume immediate liquidity. Queue demand, already-assigned exits and withdrawal mechanics still apply, and the queue only shortens if exits were the constraint.
- **Pools consolidating** toward larger effective balances can do so faster.
- **Staking apps and dashboards** must update their queue estimates and show entry, exit and consolidation capacity separately.
- **Operators** configure nothing, and unrelated wallets see little change.
- **Longer term:** faster consolidation supports later work on faster finality, but it does not deliver that work at Glamsterdam.

### ACDC #187 operational notes (not EIPs)

The ACDC #187 decision log (17 September 2026) records two things. First, clients will default to **QUIC** from the Glamsterdam release, and **MPLEX** will be deprecated, not removed, after mainnet activation. Second, it holds the **tentative Hoodi date of 27 October**. EIP-7773, crawled later, still leaves Hoodi blank. A call decision and the meta-document represent different levels of commitment.

---

## Networking changes

These EIPs sit in EIP-7773's networking section. EIP-7975 states outright that it does not change EVM consensus rules and does not need a hard fork by itself. Clients still need coordinated releases so peers speak the same protocol version, and old peers can keep using previous versions through capability negotiation. None of them has a measured sync or bandwidth improvement established on mainnet. They appear in devnet-11, but that does not mean every client has adopted them.

### EIP-7975 — eth/70: partial block receipt lists

**Problem.** devp2p messages are capped at **10 MiB**. EIP-7825 limits one transaction's logs to about 2 MiB (16,777,216 / 8), and a block full of such receipts at a gas limit of around **83M** can exceed 10 MiB. An oversized block's receipts can then block synchronization.

**Mechanism.** `GetReceipts` gains a starting index, and `Receipts` gains a flag marking the last block's list as incomplete, so clients fetch the rest in pages. Partial lists cannot be checked against the receipts root until they are complete, so the EIP adds bounds:
- the receipt count must match the transaction count;
- each receipt must be no larger than the transaction gas limit divided by 8;
- the total downloaded must fit within the block gas limit;
- total buffered input must also be bounded.

[Specification](https://eips.ethereum.org/EIPS/eip-7975).

**Who notices.** Node operators, indexers and archive services get more reliable receipt retrieval. Application developers benefit only indirectly, if failed receipt downloads were causing RPC gaps. It becomes more relevant as EIP-7708 logs and higher capacity arrive.

### EIP-8159 — eth/71: Block Access List exchange

**Mechanism.** Adds `GetBlockAccessLists` (`0x12`) and `BlockAccessLists` (`0x13`), so peers can request BALs by block hash and check the encoding against the header's BAL hash. Normal Engine API delivery does not cover retrieving *historical* BALs from peers. Without this protocol, a client that did not execute a block has a hard time getting the list it needs for parallel validation and for snap/2. [Specification](https://eips.ethereum.org/EIPS/eip-8159).

**Who notices.** Infrastructure must serve BALs or explicitly report them as unavailable or pruned, and must manage retention. Rate limiting and a recommended **2 MiB** soft limit on responses bound amplification. Checking the header hash is essential. The capability can coexist with older versions, but the BAL commitment only exists after Amsterdam activates.

### EIP-8189 — snap/2: BAL-based state healing

**Mechanism.** After downloading a state snapshot, a node today "heals" by fetching trie nodes one round at a time. snap/2 **removes the trie-node healing messages**, fetches the known sequence of BALs instead, applies the diffs in strict block order, and recomputes and verifies the state root. Version negotiation is per connection, so snap/1 peers are served as before. [Specification](https://eips.ethereum.org/EIPS/eip-8189).

**Implementation.** **Confirmed:** ethrex v28.0.0 implements snap/2. Its 29 September release note says it applies on networks where Glamsterdam is active. No representative elapsed-time benchmark has been published.

**Limits.** It only works if peers keep the required lists. Recovering from a reorg may need orphaned BALs, and if they are unavailable the sync may have to restart. Hash checks, final-root checks, peer reliability and response limits all still matter.

**Attributed expectation.** On 26 September 2026, Vitalik Buterin ([post](https://x.com/VitalikButerin/status/2103636111260373176)) wrote that sync can already finish in under half a day, and that aggressive settings can bring disk use below half a terabyte. He credited EIP-4444 and client work for those *current* figures, and said Glamsterdam will improve sync further ("for example Nimbus's new sync protocol uses it"). The half-day and half-terabyte figures describe the chain before this fork. The forward-looking sentence is an **Expected** claim.

### EIP-8070 — eth/72: Sparse blobpool

**Mechanism.** For each new blob transaction, an EL node fetches the full blob with probability **0.15**, and otherwise samples the cells that match its CL custody (1/8). This cuts redundant full replication while keeping a backbone of full providers. New cell messages and Engine API extensions require coordinated upgrades: an optional custody bitfield on `engine_forkchoiceUpdatedV4`, and `engine_getBlobsV4` cell requests. **Builders are told to fetch full blobs eagerly** for transactions they plan to include, so estimates for ordinary nodes do not apply to them. [Specification](https://eips.ethereum.org/EIPS/eip-8070).

**Expected (design calculation).** Average blobpool bandwidth is 0.15 + 0.85/8 ≈ 0.256 of full replication, about a **4× reduction** for this class of traffic. With a mesh of 50 peers, the EIP calculates a **98.6%** probability that at least 3 peers hold the full payload, and **0.03%** that none do. This does not guarantee anything about whole-node bandwidth, extra samples, adversarial topology or builder traffic.

**Measured input, from a different network.** Fusaka devnet 5 showed EL download bandwidth at about **4–5× the CL's**, at blob target/max settings of 22/33 and 48/72. That motivates the change. It is not a measurement of eth/72.

**Who notices.** Node operators, as lower bandwidth. Rollup publishers and builders still need complete blob availability. Rollup users benefit only if the network later sustains more blobs and the blob base fee responds, and EIP-7773 has no new blob target. Concentration of providers, unavailable cells, fairness heuristics and custody changes all need monitoring.

**Status nuance.** On 9 September 2026 the ethrex client account ([post](https://x.com/ethrex_client/status/2097679510925676903)) confirmed an implementation, but called EIP-8070 a draft *candidate*. The 30 September meta-file lists it in the networking section, not in Scheduled for Inclusion. Both are true at once.

### EIP-8136 — Cell-level deltas for data-column broadcast

**Mechanism.** A consensus-layer networking optimization on top of PeerDAS (EIP-7594). Peers exchange bitmaps of which cells they have, and request only the missing ones through a Gossipsub partial-message extension. A node that already holds nearly all of a column from its mempool requests the gaps instead of the whole column. It is backward compatible, needs no hard fork, and only helps on connections where both peers support it. It does not change blob pricing or the blob count. [Specification](https://eips.ethereum.org/EIPS/eip-8136).

**Tradeoffs.** The default is pull-based, which adds some dissemination latency in exchange for lower bandwidth, and eager-push policies are available. Implementation details per client and timely peer scoring matter. The benefit to data availability on the critical path should grow as columns get busier. Rollup users benefit only indirectly.

---

## Informational items

### EIP-7904 — Compute gas cost analysis

**Status.** Informational; Review. **It recommends no change to opcode or precompile gas costs.** Descriptions of it as "general gas repricing" are out of date.

**Measured.** It benchmarks synthetic EEST blocks through Benchmarkoor on Besu, Erigon, ethrex, Geth, Nethermind and Reth, all with BAL-enabled optimizations, using regression, a **100M gas/s** anchor, conservative client results and statistical-fit conditions. Every compute operation and precompile examined already met or beat the target under the current schedule.

**Limits.** The target was chosen by the authors. The clients tested already include BAL-related parallelism, so the result says nothing about serial execution. It is **not** a claim that mainnet will process 100M gas/s, and it does not cover network propagation, state growth or zk proving. The conclusion is that these operations do not need gas *increases*. It is not a recommendation to cut their cost by the percentages shown. State access is handled by EIP-8038, and the repricing guide treats state, not compute, as the dimension that had to move. Nobody needs to migrate anything for this EIP.

### EIP-8261 — Gas limit schedule

**Status.** Informational; Review. Requires EIP-7732.

**Mechanism.** After Gloas, consensus clients should read an optional `GAS_LIMIT_SCHEDULE` from `config.yaml`. Each entry starts at an epoch and supplies a **default** gas limit for validators who have not set one, plus a **recommended maximum**. Before Gloas the schedule is ignored. The point is to stop an early software upgrade from moving gas-limit defaults before a coordinated epoch. Operators can override it, and clients should warn but still honour the override. **It is not a consensus rule.** A block is not invalid for exceeding the recommendation, and the existing rules on gas-limit validity and rate of change still apply. [Specification](https://eips.ethereum.org/EIPS/eip-8261).

**Who notices.** Validators and client teams. Clients without support keep their normal behaviour. Wallets need not read the config, but tooling that depends on the gas limit must handle whatever capacity is actually realized. A wrong schedule value could spread widely.

**How it played out on Sepolia.** The Prysm 7.2.0 notes say the Sepolia 200M schedule entry landed after the release was cut, so its post-Gloas default stays at 60M unless configured, and `--suggested-gas-limit` no longer controls it. Teku 26.9.1 also defaults to 60M. This is why "fork support" does not mean a client automatically targets 200M, and why **200M is neither an activation-enforced minimum nor a guaranteed 3× TPS**.

**Where each gas-limit figure comes from.**
| Figure | What it is |
|---|---|
| 60M | Current default on the Sepolia consensus clients whose notes were inspected |
| 150M | EIP-8037's *reference* for calibrating state pricing |
| 200M | Operator opt-in on Sepolia; a test parameter on devnet-11; a direction on ethereum.org. **Not** a scheduled consensus parameter. |

---

## Migration evidence: the repricing replay

The EF's [repricing testing guide (24 August 2026)](https://blog.ethereum.org/2026/08/24/glamsterdam-repricing-testing) and the [repricing-impact dashboard](https://ethereum.github.io/repricing-impact/) replay historical mainnet transactions one at a time against canonical pre-transaction state, under the new schedule.

- **Method.** Each transaction is tested at its original gas limit and at a 10× ceiling.
  - **"Fixable"** means the transaction was rescued in the replay by a higher limit. That is not necessarily practical under protocol limits.
  - **"Potentially broken"** means it was not rescued even at the tested ceiling. That is not proof of a certain future failure.
  - **"Unknown"** marks a gap in diagnostic coverage.
- **Findings (Measured, qualitative).** The **large majority** of transactions were unaffected. A small set depended on assumptions the new prices break. Most flagged failures were fixed by a higher limit. Some stay broken regardless, especially where a contract forwards a fixed stipend.
- **What is missing.** Neither the guide text nor the dashboard extract gave aggregate counts, so **no percentage of affected contracts is quoted here**.
- **Guidance.** Look up your addresses on the dashboard and test on a Glamsterdam network: Platåberget, then Sepolia after 6 October. "Large majority unaffected" is qualified guidance, not a guarantee for any particular contract.

---

## What people on X are saying, and what the specs allow

X provided original commentary and implementation concerns, not authority over what is included. The posts were read through the authenticated X API, including note and Article text where available, with author and date fields. They show what someone said on a given date. They do not show activation or measured performance. Technical assertions were checked against the specifications cited above.

**Release and schedule statements**
- **Alex Stokes, 28 September** ([post](https://x.com/ralexstokes/status/2104719613519184019)): Sepolia on 6 October; Hoodi and mainnet dates to come separately; "blocks built without trusted relays." This matches EIP-7773 and EIP-7732.
- **ethrex, 29 September** ([release explanation](https://x.com/ethrex_client/status/2104884118555078743), [schedule post](https://x.com/ethrex_client/status/2105017899177881948)): v28 schedules Sepolia, adds snap/2, and confirms that Hoodi and mainnet have no time yet. The release body corroborates this. ethrex's June compute and stateful benchmark ranking claims came without independently inspected run conditions, so they are **not** used as performance evidence here.
- **ethrex, 4 September** ([post](https://x.com/ethrex_client/status/2095897077955899638)): a public testnet for EIP-8141, 8250, 8272, 7805 and 8369, "built on top of Glamsterdam." None of these are in EIP-7773. This shows a client team testing Hegotá-era and privacy proposals on a Glamsterdam base. It does **not** mean frame transactions or FOCIL are in Glamsterdam.

**Sync and BAL expectations**
- **Vitalik Buterin, 26 September** ([post](https://x.com/VitalikButerin/status/2103636111260373176)): current sync gains came from EIP-4444 and client work, and Glamsterdam will improve sync further. This is consistent with EIP-8189. The half-day figure describes the chain before the fork.
- **Toni Wahrstätter, 26 September** ([post 1](https://x.com/nero_eth/status/2103654571398877443), [post 2](https://x.com/nero_eth/status/2103806304469008385)): snap/2 uses BALs as state diffs. He expects a significant throughput increase, faster sync, and usefulness for future zkEVMs, partial state, inclusion lists and trie migrations. All of these are expectations. FOCIL-style inclusion lists are Hegotá work, so "future-compatible" is the accurate reading.

**Design concerns**
- **Paweł Bylica (@chfast), 1 September** ([question](https://x.com/chfast/status/2094722263379526084), [clarification](https://x.com/chfast/status/2094739921403568369)): asked how ERC-4337 works with state gas, then clarified that ordinary gas inspection cannot see it. A respondent first treated this as simply higher cost, then acknowledged the accounting gap. **The current EIP-8037 documents that the reservoir is invisible to gas inspection and sets out bundler and EntryPoint accounting requirements**, so the concern has support in the primary specification.
- **ePBS market structure, 16–17 July.** Barnabé Monnot (@barnabemonnot) with @katiabanina and Michael (@mostlyblocks).
  - Monnot distinguishes replacing *relay escrow* from replacing *all relay services*.
  - @katiabanina worries about vertical integration and barriers for new builders.
  - @mostlyblocks argues that shared merging and propagation infrastructure helps small builders.
  - Monnot treats alternative market structures as exploratory, and says some proposed services fall outside ePBS.

  These are **competing economic expectations**. The specification supports fair exchange at the protocol level, but it does not guarantee less concentration. Posts: [Monnot](https://x.com/barnabemonnot/status/2077845186428711129), [concern](https://x.com/katiabanina/status/2077781787854422332), [counterpoint](https://x.com/mostlyblocks/status/2077835684874801519), [qualification](https://x.com/barnabemonnot/status/2078127476526497825).
- **Monnot, 2 August, Article "Ethlabs is online. Week 6."** ([post](https://x.com/barnabemonnot/status/2083974773168566766)): says ePBS raises best-case Fast Confirmation Rule latency from about 13 s to about 24 s, with optimizations under way, and places shorter slots in a *later* upgrade. This is an author estimate. The underlying separation of execution from consensus is what the EIP specifies.
- **green (@forereth), 12 July** ([thread](https://x.com/forereth/status/2076275203886223611), [follow-up](https://x.com/forereth/status/2076277563224097105)): questions the incentives for clearing storage and whether code-loading costs reflect larger contracts. These are useful review questions. The post's storage-price assumptions at the time should not override the 30 September EIP-8038 table, which keeps cold storage reads at 2,100.
- **Nixo (@nixorokish), 24 September** ([post](https://x.com/nixorokish/status/2103164113841250376)): cleanup of zero-nonce storage accounts has moved to Considered status **for Hegotá**. This gives the later-fork context for EIP-8253.

Reply threads under the Stokes and Buterin posts were mostly unrelated and added no technical corrections that could be checked against a specification.

---

## Candidates, exclusions and unresolved scope

**Scope is settled but not locked.** Forkcast lists **no PFI or CFI** Glamsterdam EIPs. EIP-7723 still allows a Scheduled EIP to be moved back to Considered or Declined if client teams agree. ethereum.org calls the scope "frozen" but subject to change before mainnet. Both fit a meta-EIP at Review stage. "Frozen" is not "Included."

**EIP-7610: removed.** It would have rejected contract creation onto accounts with nonempty storage. The [removal PR](https://github.com/ethereum/EIPs/pull/12189) was approved and merged on **20 August 2026**. The devnet-9 note gives the same date, devnet-11 marks it removed, and the current EIP-7773 omits it. The ethereum.org page that still lists it is stale.

**EIP-8253: a later-fork candidate, not confirmed for Glamsterdam.** It proposes a one-time nonce bump on **28 legacy mainnet accounts**, to prevent collisions between contract creation and existing storage without a permanent runtime check. The document is a Draft.
- **The argument for it.** Its author argues that removing EIP-7610 leaves a formal inconsistency between executing storage wipes and applying BAL diffs. Triggering the issue on mainnet would need what looks like an infeasible address preimage, but that does not remove the specification concern.
- **Where it stands.** Devnet-11 excludes it. ACDE #245 listed the late-inclusion discussion. Nixo's 24 September post puts the cleanup under Hegotá consideration. No final vote transcript was inspected, and Hegotá inclusion is not guaranteed.
- [Specification](https://eips.ethereum.org/EIPS/eip-8253), [author's argument](https://gist.github.com/jochem-brouwer/72b97452ba440da909e5da5bdf876817), [ACDE #245 agenda](https://github.com/ethereum/pm/issues/2211).

**FOCIL (EIP-7805): deferred to Hegotá.** It was taken out of Glamsterdam to keep the fork smaller. [Checkpoint #8 (20 January 2026)](https://blog.ethereum.org/2026/01/20/checkpoint-8) moved it to Considered for the next upgrade, and the [Hegotá page](https://ethereum.org/roadmap/hegota/) (29 September 2026) now lists it as Hegotá's scheduled headliner. It also appears in Glamsterdam's historical Declined list. Glamsterdam adds **no** rule forcing builders to include transactions nominated by a committee, and ePBS does not provide that guarantee.

**Other notable exclusions.**
- **Declined:** EOF (EIP-7692 meta), delayed execution (7886), reduced block latency (7782), metered larger code (7907), and multidimensional gas metering (8011). All are on the historical Declined list.
- **Partial overlap:** EIP-7954 raises code size without adopting all of EIP-7907, and EIP-8037's two-dimensional metering does not mean EIP-8011 is included.
- **EOF as headliner:** discussed in the [EIP-7773 Magicians thread](https://ethereum-magicians.org/t/eip-7773-glamsterdam-network-upgrade-meta-thread/21195), but not scheduled.
- **Hegotá-era proposals:** frame transactions (EIP-8141), whether discussed in Hegotá agendas or tested "on top of Glamsterdam," are not Glamsterdam.
- **EIP-7792:** an August 2025 PR *title* proposed declining it alongside scheduling the headliners. A PR title alone is not a current Declined-list entry, and 7792 does not appear in the inspected historical Declined list below.

**Historical Declined inventory (41 EIPs).** This comes from the [pre-removal meta revision](https://github.com/ethereum/EIPs/blob/a08f51fec5b2b5da457adb05b8cffb487fb4f7de/EIPS/eip-7773.md). It was cross-checked to confirm none are in the current Scheduled list. It does not reflect individually refreshed later statuses.

> 2926 (Chunk-Based Code Merkleization); 5920 (PAY); 6404 (SSZ transactions); 6466 (SSZ receipts); 7619 (Falcon512 verifier); 7668 (Remove bloom filters); 7686 (Linear EVM memory limits); 7692 (EOFv1 Meta); 7745 (Trustless log index); 7782 (Reduce Block Latency); 7791 (GAS2ETH); 7793 (Conditional Transactions); 7805 (FOCIL); 7819 (SETDELEGATE); 7872 (Max blob flag for local builders); 7886 (Delayed execution); 7903 (Remove Initcode Size Limit); 7907 (Meter Contract Code Size And Increase Limit); 7919 (Pureth Meta); 7923 (Linear, Page-Based Memory Costing); 7932 (Secondary Signature Algorithms); 7937 (EVM64); 7942 (Available Attestation); 7949 (genesis.json schema); 7971 (Hard Limits for Transient Storage); 7973 (Warm Account Write Metering); 7979 (Call and Return Opcodes); 8011 (Multidimensional Gas Metering); 8013 (Static relative jumps and calls); 8030 (P256 transaction support); 8032 (Size-Based Storage Gas Pricing); 8051 (ML-DSA verifier); 8053 (Milli-gas); 8057 (Inter-Block Temporal Locality Gas Discounts); 8058 (Contract Bytecode Deduplication Discount); 8059 (Gas Units Rebase); 8062 (0x01 validator sweep withdrawal fee); 8068 (Neutral effective balance); 8071 (Prevent consolidations as withdrawals); 8080 (Let exits use consolidation queue); 8254 (Cap Deposit Requests Per Block).

**Uncertain: the current Declined count.** Forkcast shows **37** declined in one section and **44** in another, with details collapsed, and the two figures cannot be reconciled from what was retrieved. The complete current Declined inventory is a known evidence gap. No entries or reasons have been invented to fill it.

**Hegotá process (not Glamsterdam scope).** Hegotá is expected in Q2 2027 with no date set. FOCIL is scheduled as its headliner, one other change is scheduled, and the rest is open. Frame transactions are part of the still-open account-abstraction discussion. ACDC #187 recorded, for Hegotá: EIP-8411 as Proposed; EIP-8015 as Considered; and EIP-8237, 8341, 8367, 8321, 8243, 8146 and 8375 as Declined.

**Claims that do not come from the specifications.** Secondary articles claiming a **78% gas cut**, **10,000 TPS**, or a **90% disk reduction from Verkle trees** are describing something other than the specifications. Verkle and the disk-reduction claim come from secondary Hegotá commentary, not the Glamsterdam meta-EIP. Secondary write-ups also claimed builder abuse on Sepolia and a 200M gas floor. Neither claim appears in EIP-7773, the EF announcement or the ACDC decision file.

---

## What to do, by role

**ETH holders and end users**
- Do nothing for the Sepolia fork. Ignore any request to "upgrade your ETH." Such requests are a scam pattern.
- When a mainnet date is announced, update wallets and hardware-wallet apps so gas estimates match the fork, then keep using the same accounts.
- Expect different gas estimates, especially when sending to fresh addresses. Do not expect guaranteed lower fees.

**Application and smart-contract developers**
1. Read the [repricing guide](https://blog.ethereum.org/2026/08/24/glamsterdam-repricing-testing) and check deployed addresses in the [impact dashboard](https://ethereum.github.io/repricing-impact/).
2. Search code for fixed gas stipends, `transfer`/`send`, `address.call{gas: N}`, `gasleft()` arithmetic and branches, and hardcoded `21000`. A higher outer gas limit cannot repair every immutable contract assumption.
3. Re-test deployments, new-account funding, storage initialization, cold external calls, `EXTCODESIZE` probes and EIP-7702 flows against a Glamsterdam client: Platåberget, then Sepolia.
4. Review ERC-4337 accounting for state gas that `gasleft()` cannot see.
5. Update log and event consumers for EIP-7708 logs and any changes to log indices. Update consensus proof verifiers for EIP-7688.
6. Decide whether the larger code limit is worth the per-byte state gas. Treat `SLOTNUM` and `DUPN`/`SWAPN`/`EXCHANGE` as optional adoptions after activation.
7. If you depend on `SELFDESTRUCT` burning ETH, redesign before activation. Watch for CREATE2 redeployment onto preserved balances.
8. If you deploy to the same address across chains, EIP-7997 matters most for the *other* chains. Use fully deterministic initcode, and replace presigned factory deployments.

**Wallets, bundlers and RPC providers**
- Ship two-dimensional gas estimation (execution plus state), including combined floors, and support `tx.gas` above the old execution-only cap.
- Stop assuming 21,000 covers every transfer.
- Re-estimate and re-sign any queued or presigned transactions whose limits were computed under the old schedule.
- Recompute whether automatic access lists still pay for themselves.
- Index EIP-7708 logs if you currently infer ETH transfers from traces, without double-counting.
- Accept code up to 65,536 bytes and initcode up to 131,072 bytes in verifiers and deployers.
- Keep traces and counters separate from the gas users pay.

**Builders and infrastructure**
- Review ePBS bidding, funding, reveal and PTC-related monitoring, and EIP-8282 registration, before building against the fork.
- Do not assume a relay is still the settlement layer.
- Update packing for gross gas (EIP-7778) and for two resource dimensions (EIP-8037).
- Reprice large calldata and access lists.
- Use the finalized EIP-8282 deployment guidance. Wrong first-deposit signatures forfeit stake.

**Node operators and validators**
- For Sepolia, upgrade **both** clients (and validator clients and signers) before **6 October 2026, 13:53:36 UTC**, using releases that name the activation.
- Set a gas-limit preference explicitly if you do not want the client default (60M on Prysm and Teku).
- Watch for the QUIC default and the MPLEX deprecation.
- For Hoodi and mainnet, wait for an announcement that fills in EIP-7773.
- Budget for the shorter (~7-day) weak-subjectivity period and keep checkpoints fresh.

**Staking applications**
- Update queue estimators so they show entry, exit and consolidation capacity separately.
- Do not promise instant liquidity.

**Rollup operators**
- Separate L1 publishing and settlement effects from your own EVM fork.
- Audit `SELFDESTRUCT` burn dependencies (OP Stack `L2ToL1MessagePasser.burn()`), contract-size limits, the new opcodes and gas accounting before adopting L1 semantics.
- Calldata posters are affected by EIP-7976. Blob posters are not directly affected.
- Communicate actual fee and withdrawal changes only after measuring them.

---

## Uncertainties

- **Mainnet** has no epoch. Q4 2026 is an expectation that follows earlier slipped targets.
- **Hoodi's** 27 October date is a call decision, not a filled-in EIP-7773 row. Confirmation is expected on 8 October.
- **Scheduled is intent, not activation.** The meta-EIP is in Review, and scheduled EIPs can still be removed.
- **Gas constants.** EIP-8037 says the EIP-8038 access and write constants are not final. The numbers here are the review text as of 30 September 2026. Some standalone EIP texts (7976, 7981) still show older constants that differ from the composed fork schedule.
- **Client completeness.** Grandine and Lighthouse were blank in the Sepolia table. The devnet-11 readiness table is from 8 September. Hive's August BAL-hash divergence may be stale. The outcomes of adversarial, reorg and ecosystem testing are not established.
- **ethereum.org wording.** The fee FAQ and the "200M gas limit floor" phrasing go further than EIP-2780, EIP-8261 and the Sepolia defaults. The page also still mentions EIP-7610 and calls the meta-EIP a draft.
- **Design figures are not measurements:** the ~9 s payload window, ~7-day weak-subjectivity period, ~4× exit and ~2× consolidation churn, ~37% and ~21% worst-case block-size reductions, ~4× blobpool bandwidth reduction, ~3× throughput target, ~120 GiB/year state growth, and ~13 → 24 s FCR latency.
- **EIP-7904's 100M gas/s** is a benchmark target for compute opcodes on BAL-enabled clients only.
- **Repricing replay:** "large majority unaffected," but the exact counts were not retrieved.
- **The current full Declined inventory** cannot be reconciled (37 vs 44 on Forkcast).
- **EIP-8282 contract code and addresses** were not independently audited.
- **Rollup adoption** of L1 EVM changes, and the migrations each rollup needs, are unknown.
- **X coverage** is selective. Neither archive search was exhausted.

---

## Where the two source reports differ

The two inputs are referred to as the **Codex report** and the **Grokbuild report**, after the harnesses that produced them. Both answered the same question from the same 30 September snapshot using the same four providers. They agree on every headline fact: the name and its components, the Sepolia epoch, slot and time, the tentative status of Hoodi, the Q4 2026 mainnet target, the 18 + 5 + 2 scope, the EIP numbers and titles, the removal of EIP-7610, the deferral of FOCIL, the 28 September byline on the 17 September URL, the Sepolia client release table, and the "200M is not a consensus floor" conclusion. The differences are in precision, emphasis and coverage.

### Substantive differences, and how they were resolved

| # | Topic | Codex report | Grokbuild report | Resolution in this synthesis |
|---|---|---|---|---|
| 1 | **EIP-7708 scope** | Specified **nonzero** transfers **between different accounts**. Emitter `0x…fffe`. Fees, base-fee burn and withdrawals excluded. Rolled-back transfers leave no log. | "Every ETH transfer emits a log." Adds that the log cost is folded into EIP-2780's `TX_VALUE_COST`. | **Sided with Codex** on scope, because it is more specific and matches spec-level exclusions. **Kept Grokbuild's** unique cost-folding detail. |
| 2 | **EIP-8246 scope and severity** | Only **same-transaction** create-and-destroy. EIP-6780 behaviour for existing contracts unchanged. Only two post-Cancun burns found historically. Flags CREATE2 redeploy theft risk and the OP Stack `burn()`. Last Call deadline 4 Nov. | "A contract that used self-destruct to burn a balance will leave that ETH in place." Calls it "one of the sharper compatibility items" because no opt-in is needed. | **Sided with Codex** on scope: Grokbuild's wording could be read as covering all SELFDESTRUCTs. **Kept Grokbuild's** point that the change is silent and needs no opt-in, while noting that the real-world footprint is small on L1 and significant for OP Stack chains. |
| 3 | **SLOTNUM gas cost** | **2 gas.** | No figure: the specification body was truncated in its extract. | **Used Codex's** 2 gas. |
| 4 | **EIP-7981 constants** | Surcharge of 64 gas/byte = **1,280/address, 2,048/key**. Notes that the EIP's displayed 2,400/1,900 are older constants, and that EIP-8038 sets prepayments of 2,900/2,000. | Describes the standalone text: 2,400/1,900 base, a 16/token floor from EIP-7976, then byte counting. Adds the **~21%** worst-case reduction claim. | Not a true contradiction, since 16/token × 4 tokens per byte = 64/byte. **Presented Codex's composed-schedule view** as the operative one, and **kept Grokbuild's** 21% figure and its description of the standalone text. |
| 5 | **Whether the gas constants are final** | Presents the EIP-8038 table as current, with no caveat about finality. | Flags that **EIP-8037 itself says** the companion constants "are not yet final." | **Kept Grokbuild's caveat** prominently. It is a direct quote from the spec and matters to anyone hardcoding estimators. |
| 6 | **Sparse-blobpool arithmetic** | 0.15 + 0.85/8 ≈ **0.256**. | ≈ **0.25**. | **Used 0.256**, which is the correct arithmetic (0.25625). Both round to "about 4×." |
| 7 | **Fee messaging on ethereum.org** | Hedged: lower fees are "expected possibilities whose scale remains uncertain." | Explicitly calls out a **conflict**: the ethereum.org FAQ says fees will "most likely" fall and credits EIP-2780, while the EIP-2780 text keeps the 21,000 transfer. | **Adopted Grokbuild's explicit framing.** The two reports agree in substance, but naming the conflict is more useful to readers. |
| 8 | **Evidence of settled scope** | Forkcast shows **zero PFI and zero CFI**. Gives a **41-EIP historical Declined list** from a pre-removal revision. Notes the Forkcast 37/44 discrepancy. | Relies on the current meta-file having no Proposed, Considered or Declined lists, per the EIP-7723 Review rule. Declines to infer Declined membership from a PR title (EIP-7792). | **Combined.** Both lines of evidence are included, the historical list is labelled as historical, and Grokbuild's caution about 7792 is kept. The 41-item list does not contain 7792, which is consistent with that caution. |
| 9 | **How FOCIL is classified** | On Glamsterdam's historical **Declined** list, and part of the later Hegotá roadmap. | **Moved to Considered for the next upgrade** (Checkpoint #8, 20 Jan 2026), and now **Hegotá's scheduled headliner**. | These are compatible: Declined for Glamsterdam, then promoted for Hegotá. **Both are stated.** |
| 10 | **Sepolia gas-limit defaults** | Prysm only: default 60M because the 200M schedule entry landed after the release was cut, and `--suggested-gas-limit` has no effect after Gloas. | Prysm **and Teku** default to 60M. Gives the Teku flag and Prysm's v2 proposer settings / keymanager route. | **Combined.** Codex supplies the reason, Grokbuild the second client and the configuration paths. |
| 11 | **Evidence-label schemes** | Confirmed fact / Measured outcome / Expected benefit / Projection or author claim. | Confirmed / Measured / Expected / **Uncertain**. | **Adopted Grokbuild's four labels.** Author claims are placed under Expected, and Uncertain adds a category for conflicts between sources. |
| 12 | **EIP-8061 quotient wording** | Exit quotient becomes 32,768; consolidation quotient 65,536. | "The churn quotient for activations and exits is halved," from 2^16 to 2^15. | Both agree that activations stay **capped at 256 ETH/epoch**, so the effective activation rate does not change either way. The synthesis says the **exit** quotient is halved, which is the change that matters in practice. |

### Coverage that only one report had (kept in the synthesis)

**Only in the Codex report**
- Devnet-11 specifics: consensus-specs v1.7.0-beta.0, fixtures v8.1.4, the 8 September readiness snapshot, ecosystem participants, and adversarial testing on devnet-8.
- The ethrex v28 and Prysm 7.2.0 release contents, including the builder circuit breaker and progressive merkleization.
- EIP-8037 hazards: the reservoir is invisible to `gasleft()`, gas-left can go negative or wrap, ERC-4337 accounting, "some metering contracts cannot be fixed," the 2^32−1 total limit, bottleneck-dimension base-fee updates, and state-size data (390 GiB; 105 → 326 MiB/day).
- EIP-7928 statistics: 72.4 KiB average BAL, 60–80% disjoint storage.
- EIP-7778's historical block example (20878522).
- EIP-8061's weak-subjectivity shift from 15.7 to 7 days, and the ~4×/~2× churn figures.
- EIP-8282 details: proof of possession, stake forfeiture on a bad signature, pre-fork deployment requirement, and 64/16 dequeue caps.
- EIP-8246: the CREATE2 redeployment theft risk and the OP Stack `burn()` dependency.
- EIP-8253 and its relationship to the removal of EIP-7610, and the EIP-7610 removal PR.
- The ePBS free-option risk, and Monnot's estimate of FCR latency rising from ~13 to ~24 s.
- The replay dashboard's category definitions (fixable, potentially broken, unknown).
- X posts from @chfast, Monnot, @katiabanina, @mostlyblocks, @forereth and Nixo, and ethrex's 9 September post on EIP-8070.
- The 41-EIP historical Declined inventory.

**Only in the Grokbuild report**
- The polar bear mascot (EIP-8066), the Fusaka activation date (3 Dec 2025), and Hegotá's Q2 2027 expectation.
- The history of mainnet timing slips (H1 → June → Q3 → Q4).
- EIP-2780 constants (`TX_BASE_COST` 12,000, `TX_VALUE_COST` 6,000) and the contract-creation path (24,000 + 183,600).
- The storage-clear refund row in EIP-8038 (4,800 → 11,616) and the percentage change for each row.
- EIP-8037: account creation by `CALL` moving from 25,000, and code deposit moving from 200 gas/byte.
- EIP-7976's worked numbers (671M vs 105M gas for 10 MiB; ~37%) and EIP-7981's ~21%.
- EIP-8024 opcode bytes (`0xe6`–`0xe8`) and reach (17–235; top 30).
- EIP-7997: front-running risk from `ORIGIN`/`NUMBER`.
- EIP-7975's ~83M gas-limit threshold, and EIP-8070's 50-peer availability probabilities.
- Hive #1589 BAL-hash divergence.
- Operational notes: the QUIC default and MPLEX deprecation, the bug bounty scope, the Teku configuration flag, and the stale "H1 2026" copy of the ethereum.org page.
- Hegotá stage changes recorded at ACDC #187.
- Debunking of secondary-media claims (78% gas cut, 10,000 TPS, Verkle and 90% disk reduction; builder abuse on Sepolia).
- X posts from Alex Stokes, Vitalik Buterin and Toni Wahrstätter, and ethrex's 4 September "on top of Glamsterdam" testnet post.

### Differences in research approach

| Aspect | Codex report | Grokbuild report |
|---|---|---|
| Octen broad search | One call, 8 angles × 5 results, 1,200-token highlights, X domains excluded | One call, 8 angles × 5 results, 600-token highlights |
| Extraction | Octen extract plus Exa fetch for full specs; some fetch failures (EIP-8045/8061 pages returned only headings; Forkcast JSON unavailable) | Octen extract for raw EIP files, the EF blog, ethereum.org pages and the Forkcast ACDC #187 JSON |
| Exa | Semantic discovery plus full-spec fetch | Three discovery searches; URLs then read through Octen |
| Perplexity | Fast and Web search modes | Fast mode only, four calls |
| X | Full-archive search from 1 Jan to 30 Sep, larger result caps (50–60), three conversation threads | Mostly recent search plus two small archive calls (10 results each) from July/August |
| Resulting X coverage | Design debate from July to September (ePBS market structure, 4337, storage incentives) | Late-September release and expectation posts (Stokes, Buterin, Wahrstätter) |

The two X samples barely overlap (only ethrex's 29 September post appears in both). Together they give a broader picture than either alone, but it is still not a complete census.

---

## Method and limits

- **Sources.** Both input reports used Octen (broad search, targeted search, extract), Exa (semantic search, and fetch in one case), Perplexity Search (search mode only; no Ask, Reason or Research answers used as evidence), and the X API, authenticated read-only with no scraping, using an account belonging to the person who requested the research. Neither report used a native web search or browser, or adopted any provider-generated narrative as a finding. Meeting-summary snippets with malformed fork names were treated as leads only.
- **This synthesis.** No new searching or independent fact-checking was done. Conflicts were resolved by comparing how specifically each report tied a claim to a primary source, plus basic arithmetic checks. Where the reports agree, that agreement reflects the same underlying primary sources and is not independent verification.
- **What was not done by either report.** No benchmark, chain replay or client test was reproduced. No client code, deployed request-contract bytecode or address was audited. X archive searches had unexhausted pagination tokens. Posts that are protected, deleted or unavailable at that access level are not visible.
- **Snapshot.** Everything reflects evidence available on 30 September 2026. The Sepolia activation (6 October), the Hoodi confirmation call (8 October) and the EIP-8246 Last Call deadline (4 November) all fall after this snapshot, and could change the picture materially.
