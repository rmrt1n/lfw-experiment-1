package frainrollup_test

import (
	"testing"

	keepertest "frain-rollup/testutil/keeper"
	"frain-rollup/testutil/nullify"
	frainrollup "frain-rollup/x/frainrollup/module"
	"frain-rollup/x/frainrollup/types"

	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.FrainrollupKeeper(t)
	frainrollup.InitGenesis(ctx, k, genesisState)
	got := frainrollup.ExportGenesis(ctx, k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
