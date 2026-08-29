// Original: src/utils/bash/specs/srun.ts
var srun, srun_default;
var init_srun = __esm(() => {
  srun = {
    name: "srun",
    description: "Run a command on SLURM cluster nodes",
    options: [
      {
        name: ["-n", "--ntasks"],
        description: "Number of tasks",
        args: {
          name: "count",
          description: "Number of tasks to run"
        }
      },
      {
        name: ["-N", "--nodes"],
        description: "Number of nodes",
        args: {
          name: "count",
          description: "Number of nodes to allocate"
        }
      }
    ],
    args: {
      name: "command",
      description: "Command to run on the cluster",
      isCommand: !0
    }
  }, srun_default = srun;
});
