package keeper_test

import (
	"testing"

	"github.com/stretchr/testify/require"

	keepertest "frain-rollup/testutil/keeper"
	"frain-rollup/x/frainrollup/types"
)

func TestGetParams(t *testing.T) {
	k, ctx := keepertest.FrainrollupKeeper(t)
	params := types.DefaultParams()

	require.NoError(t, k.SetParams(ctx, params))
	require.EqualValues(t, params, k.GetParams(ctx))
}
