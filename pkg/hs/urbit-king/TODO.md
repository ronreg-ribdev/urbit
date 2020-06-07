# New IPC Protocol

Stubbed out:

- [x] Handle replacement events (stubbed out now b/c interface can't
      handle unparsed nouns)
- [x] Handle IPC errors by killing serf process.
- [x] Handle `peek` and `pack` in `swimming` flow.
- [x] Documentation for `Urbit.Vere.Serf.IPC`.
- [x] Unstub slog/stder/dead callbacks on serf config.
- [x] Remove GoodParse hack in newRunCompute.
- [x] Bring back tank printing.
- [x] Handle serf stderr message correctly.
- [x] Bring back `logEvent`.
- [x] Snapshots should block until that event is commited to disk.
- [x] Hook up error callbacks to IO Drivers.
- [x] Do something useful with error callbacks from IO Drivers.

Bugs:

- [x] In non-daemon-mode, ^D doesn't bring down Urbit properly.

King-Haskell specific features:

- [x] Re-implement `collectFX` flow in Serf/Pier.
- [x] Hook up `collectFX` to CLI.
- [ ] Get `collect-all-fx` flow working again.

Performance:

- [x] Batching during replay.
- [x] Batching during normal operation.

Polish:

- [x] Cleanup batching flow.
- [x] Think through how to shutdown the serf on exception.
- [x] King should shutdown promptly on ^C. Always takes 2s in practice.
- [x] Bring back progress bars.
- [x] Make sure replay progress bars go to stderr.
- [ ] Logging for new IPC flow.
- [ ] Logging for boot sequence.
- [ ] Take snapshots on clean shutdown.

# Misc Bugs

- [ ] `king run --collect-fx` flag does nothing. Remove or implement.
- [ ] Handle ^C in connected terminals. It should interrupt current
      event (send SIGINT to serf, which will cause the current event to
      fail promptly).
- [ ] The terminal driver seems to have a race condition when spinner
      changed too quickly.

# Cleanup

- [x] ShutdownSTM action that's passed to the terminal driver should
      live in `KingEnv` and should be available to all drivers.
- [ ] Break most logic from `Main.hs` out into modules.
- [ ] Simplify `Main.hs` flows.
- [ ] Cleanup Terminal Driver code.
- [ ] Spin off `Urbit.Noun` into it's own package.

# Event Prioritization

- Instead of each IO driver being passed a TQueue EvErr, each IO driver
  produces a (STM (Maybe RunReq)).

  - Each driver has it's own event queue that feeds this action.

  - Pier has a thread that pulls from these actions with prioritization.

- Priority:
  - If any terminal events are available, send it.
    - If serf queue is full, abort transaction and retry.
  - If no terminal events are available, do the same thing with sync driver.
  - Next, same thing for behn.
  - Next, same thing for iris.
  - Next, same thing for ames.
  - Next, same thing for eyre.


# Better IO Driver Startup Flow Separation

Should have a io-driver-boot stage.

- IO drivers do their boot flows.
- When they're done, they signal that they're running.
- No semantically important communication without outside world can
  happen until all drivers are up.

Something like:

```
data DriverConfig = DriverConfig
  { onAllDriversUp :: STM ()
  }

data DriverApi = DriverApi
  { eventQueue   :: STM (Maybe RunReq)
  , effectSink   :: Effect -> STM ()
  , blockUntilUp :: STM ()
  , killDriver   :: STM ()
  }

type Driver = DriverConfig -> RIO e DriverApi
```