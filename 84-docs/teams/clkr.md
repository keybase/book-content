
# Cascading Lazy Key Rotations (CLKR)

There are 4 important cases in which a Team's keys must be rotated:

1. A team member revokes a device
1. A team member leaves the team
1. A team member is removed from the team
1. A team member resets his/her account

After the rotation, the remaining members of the team get access to the new team keys on all of their
devices, but the removed user (or revoked device) should not have access to the new team keys.
The above cases can be further split up into two general cases: a key rotation on the critical
path by the user performing the action, and a key rotation off the critical path by
a totally different admin. We'll hit both cases below:

## Key Rotation on the Critical Path

When an admin removes a user from a group, he can rotate the team's keys at the same time,
in the same transaction.

## Key Rotation off the Critical Path (CLKRs)

In the other three cases, it doesn't make sense for the user performing the operation
to rotate the team's key, because the user is either no longer in the team, or doesn't
have a trusted device with which to do so.

In these circumstances, Keybase's servers orchestrate a key rotation. Keybase
enumerates all admins who are capable of rekeying the team, and delegates the
rekeying responsibility to one at a time until the action completes.
Admins who are currently online on a non-mobile device are favored to
perform the key rotation.

