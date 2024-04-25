package types

const (
	// ModuleName defines the module name
	ModuleName = "frainrollup"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_frainrollup"
)

var (
	ParamsKey = []byte("p_frainrollup")
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
