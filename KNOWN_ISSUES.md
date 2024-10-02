# e2e tests

Since **version 1.4.0**, after loading a new data file, the date is not reseted to current one.
This causes the e2e test fail and show different screenshots. After loading the file, the same date than the
test before is shown. The utility `setMonthAndYear` does not work, because the date is not updated.
See commit `d37026150b332c497b4bae0c921bf3c04e9859a0` file `graphics.component.ts`.
