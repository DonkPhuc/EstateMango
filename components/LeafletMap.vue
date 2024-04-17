<script setup lang="ts">
import axios from "axios";
import getCurrentLocation from "~/utils/map";
const estateTileList = ref([
  {
    name: "Quy hoạch sử dụng đất",
    value: "https://cdn.estatemanner.com/tile/qhsdd/{z}/{x}/{y}.png",
    checked: false,
  },
  {
    name: "Thửa đất",
    value: "https://cdn.estatemanner.com/tile/ranh_thua/{z}/{x}/{y}.png",
    checked: false,
  },
  {
    name: "Quy hoạch lộ giới",
    value: "https://cdn.estatemanner.com/tile/qhlg/{z}/{x}/{y}.png",
    checked: false,
  },
]);
const mapRef = ref(null);
const isShowSidebar = ref(false);
const isLoading = ref(false);
const zoom = ref(16);
const estateData = ref();
const polygonPoints = ref<[number, number][]>([]);
const center = ref([10.738535616300815, 106.61713847327917]);
const urlTile = ref("http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}");

/**
 * Toggles the visibility of the sidebar.
 * When called, this function flips the value of isShowSidebar,
 * which controls whether the sidebar is displayed or hidden.
 */
const toggleSidebar = () => {
  isShowSidebar.value = !isShowSidebar.value;
};

const withLoading = async (action: () => Promise<void>) => {
  isLoading.value = true;

  try {
    await action();
  } catch (error) {
    console.error("Error:", error);
    isLoading.value = false;
  }

  isLoading.value = false;
};

/**
 * Moves the map view to a predefined location.
 * When called, this function updates the center coordinates of the map to [30, 30].
 */
const flyToMyLocation = async () => {
  await withLoading(async () => {
    const { lat, lng } = await getCurrentLocation();
    center.value = [lat, lng];
  });
};

/**
 * Toggles the 'checked' property of an item in the estateTileList array.
 * This function takes an item object as input and finds the corresponding item in the array by its name.
 * It then toggles the 'checked' property of that item.
 * @param item - The item object to toggle.
 */
const handleCheckedOverlay = (item: { name: string }) => {
  const index = estateTileList.value.findIndex((e) => e.name === item.name);
  estateTileList.value[index].checked = !estateTileList.value[index].checked;
};

/**
 * Switches between different tile layers for the map.
 * When called, this function alternates between two different URL patterns for the tile layer,
 * effectively changing the map's appearance.
 */
const changeLayer = () => {
  urlTile.value =
    urlTile.value === "http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}"
      ? "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
      : "http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}";
};

/**
 * Handles map click events.
 * This function is triggered when a user clicks on the map.
 * It captures the latitude and longitude coordinates of the clicked location (latlng) from the event object.
 * If latlng exists, it updates the center coordinates of the map to the clicked location and sets isShowMarker to true,
 * indicating that a marker should be displayed at that location on the map.
 * @param event - The event object containing information about the click event, including the latlng property.
 */
const handleMapClick = async (event: { latlng: any }) => {
  const { latlng } = event;
  center.value = [latlng.lat, latlng.lng];
  await getPolygonPoints();
};

const getPolygonPoints = async () => {
  await withLoading(async () => {
    const { data, status } = await axios({
      method: "POST",
      url: "https://dzbduhthfol7a.cloudfront.net/estatemanner/get-data",
      data: {
        method: "POST",
        endpoint: "/map/feature/coord",
        query_params: null,
        body: { lat: center.value[0], lng: center.value[1] },
        estatemanner_access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGllbnR8SDljejBEckxMWmVhNDB5R3NtS2c2VVUyem1BeVFCTFUiLCJjbGllbnRfbWV0YWRhdGEiOnsibGltaXQiOjIwMDAsInR5cGUiOiJxdWFudGl0eSJ9LCJpYXQiOjE3MTMyMzM4MTMsImV4cCI6MTcxMzI1NTQxMywiYXVkIjoiYXBwLmVzdGF0ZW1hbm5lci5jb20iLCJpc3MiOiJhcHAuZXN0YXRlbWFubmVyLmNvbSJ9.eJb6GbnAVaMbfQgYUI5eV7conFJmIVaqMF5GdEca3Vs",
      },
      headers: {
        Authorization:
          "eyJraWQiOiJkTG5FWVJZT3RsT3hCVkVXZlYxdVdpdnFjdk9kN0JtanVaQWxxWjZ3OXZzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhZTZjZjZmYy0zNjk3LTQyNDMtOWRmMS0yYWQ5NDhmNTFkZTYiLCJjb2duaXRvOmdyb3VwcyI6WyJhcC1zb3V0aGVhc3QtMV9mVk1IYTd4eEVfR29vZ2xlIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aGVhc3QtMV9mVk1IYTd4eEUiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIzdmQwZGFvOXZ2dWtzajY2NzdudThvZWg1MiIsIm9yaWdpbl9qdGkiOiIyZGZmODg1ZS00Yzg5LTRhZWYtYjI1MC1mM2JiNmY2YTVlNGMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNzEzMjMzODA1LCJleHAiOjE3MTMzMjAyMDUsImlhdCI6MTcxMzIzMzgwNSwianRpIjoiNDY4NDUyMmItZjkyZC00YTg2LTllYjAtZjFhZGQ3MzA4ZDdiIiwidXNlcm5hbWUiOiJnb29nbGVfMTEzMDI1NzkyNzE0NjA2MDMwOTc0In0.VSTkCwqJD-9MaHMZri_2yfdgGCweLKhsCrt4X6v7h7eox44jakOvyo5w-vQwZNxdKiu61gVnpoRpuojtOZ_j9a9n0DGWHWhiXdlt4vvPdQUokPR_fZcZPR1GztWsRA7430jWQrQ4BQQpUuHipEW3RC02Uj2JiprbxS1HJANZZxZAnPQV_nUKpEKcNeSAKUEKSwlookhJ3dEIAO129D1UZlyHT0-C4TEbcCsWkE4PctSIO8qtoB-XiCcACwqx87iV45529VrpcAEf32IUUVOYAynFFkoMv7TKL3Qoo99FxhB_sCEYfoUWgD_-aMvAdyzjkmtWC2iO2ytM5FxIReABCw",
      },
    });

    if (status === 200 && data) {
      const parseData = JSON.parse(data.data.estatemanner_data);
      if (parseData?.attributes) {
        estateData.value = parseData.attributes;
      }
      if (parseData.geo_data) {
        if (parseData.geo_data.geometry.type === "MultiPolygon") {
          polygonPoints.value = parseData.geo_data.geometry.coordinates[0][0];
        } else {
          polygonPoints.value = parseData.geo_data.geometry.coordinates[0];
        }
        polygonPoints.value = convertLatLngOrder(polygonPoints.value);
      }
      isShowSidebar.value = true;
    }
  });
};

/**
 * reserve array
 * @param coordinates
 */
const convertLatLngOrder = (
  coordinates: [number, number][]
): [number, number][] => {
  return coordinates.map(([lng, lat]) => [lat, lng]);
};

const translateKey = (key: string): string => {
  const translations: Record<string, string> = {
    so_to_ban_do: "Số tờ bản đồ",
    so_hieu_thua: "Số hiệu thửa",
    so_nha: "Số nhà",
    duong: "Đường",
    phuong: "Phường",
    quan: "Quận",
    wgs84: "WGS84",
    loai_dat_quy_hoach: "Loại đất quy hoạch",
    tong_mat_tien: "Tổng mặt tiền",
    quyet_dinh: "Quyết định",
    do_an: "Đồ án",
    huong: "Hướng",
    nhan_dien: "Nhận diện",
    dien_tich_thua: "Diện tích thửa đất",
    chieu_sau: "Chiều sau",
    mat_tien: "Mặt tiền",
    rong_hem_nho_1: "Rộng hẻm nhỏ 1",
    hem_truoc_nha_1: "Hẻm trước nhà 1",
    khoang_cach_1: "Khoảng cách 1",
    tiep_giap_1: "Tiếp giáp 1",
    tinh: "Tỉnh",
    dt_k_phu_hop: "Diện tích không phù hợp",
  };
  return (translations[key] as string) || key;
};

const filterShouldShowData = computed(
  () => (key: string | number, value: string) => {
    return (
      !key.toString().includes("level") &&
      !key.toString().includes("WGS") &&
      !key.toString().includes("vn2000") &&
      !key.toString().includes("mdsdd") &&
      value &&
      value.replace(" ", "").length > 0
    );
  }
);
</script>

<template>
  <Spinner v-if="isLoading" />
  <div class="w-full h-screen flex flex-col">
    <div class="h-1 flex flex-1">
      <div
        :class="`sidebar flex flex-col gap-4 p-2 ${
          isShowSidebar ? 'open' : 'closed'
        }`"
      >
        <div class="flex justify-between items-center">
          <p class="font-bold text-xl">BẢN ĐỒ QUY HOẠCH</p>
          <Icon name="ri:close-large-fill" @click="toggleSidebar" />
        </div>
        <div class="flex gap-2">
          <div v-for="item in estateTileList" :key="item.name">
            <UCheckbox @click="handleCheckedOverlay(item)">
              <template #label>
                <span class="italic text-black"> {{ item.name }} </span>
              </template>
            </UCheckbox>
          </div>
        </div>
        <!-- <UButton color='gray' block>Tìm kiếm</UButton> -->
        <!-- Detail content -->
        <p class="font-bold text-xl">Thông tin chi tiết</p>
        <table class="divide-y divide-gray-200 bg-white">
          <template v-if="estateData">
            <tbody v-for="(value, key) in estateData" :key="key">
              <tr v-if="filterShouldShowData(key, value)">
                <td class="py-3 text-sm font-medium text-gray-900">
                  {{ translateKey(key.toString()) }} : <b>{{ value }}</b>
                </td>
              </tr>
            </tbody>
          </template>
          <template v-else>
            <i>Không tìm thấy dữ liệu tại khu vực này!</i>
          </template>
        </table>
      </div>
      <LMap
        ref="mapRef"
        :options="{ attributionControl: false, zoomControl: false }"
        :zoom="zoom"
        :center="center"
        :bounds="center"
        @click="handleMapClick"
      >
        <LTileLayer :url="urlTile" layer-type="base" />
        <LMarker :latLng="center" />
        <div
          v-for="(item, index) in estateTileList.filter((e) => e.checked)"
          :key="index"
        >
          <LTileLayer :url="item.value" layer-type="overlay" :max-zoom="18" />
        </div>
        <LPolygon :lat-lngs="polygonPoints" layer-type="overlay" />

        <!-- topleft -->
        <LControl position="topleft">
          <UButton
            color="gray"
            :class="`${isShowSidebar ? 'hidden' : 'block'}`"
            @click="toggleSidebar"
            ><Icon name="ri:information-2-fill"
          /></UButton>
        </LControl>

        <!-- topright -->
        <LControl class="flex flex-wrap gap-2" position="topright">
          <UButton color="gray">Nâng cấp gói</UButton>
          <UButton color="gray">Lượt tra cứu 0/5</UButton>
          <UButton color="gray" @click="flyToMyLocation"
            ><Icon name="uil:github"
          /></UButton>
        </LControl>

        <!-- bottomright -->
        <LControl position="bottomright" class="flex flex-col gap-2 items-end">
          <div>
            <UButton
              color="gray"
              @click="flyToMyLocation"
              class="w-auto"
              title="Find my location"
            >
              <Icon name="ri:focus-3-line" />
            </UButton>
          </div>
          <button
            class="w-16 h-16 border border-white rounded-md relative"
            @click="changeLayer"
          >
            <img
              :src="
                urlTile.includes('rs=y')
                  ? 'https://cdn.tgdd.vn/Files/2021/09/16/1383076/cachdocbandodiahinh6-_1366x768-800-resize.jpg'
                  : 'https://i1.wp.com/www.gearthblog.com/wp-content/uploads/2017/01/ColdSpringExtent.jpg'
              "
              class="w-full h-full rounded-md"
              alt=""
            />

            <span
              class="w-full rounded-b-md absolute bottom-0 right-0 bg-black opacity-80"
              >{{ urlTile.includes("rs=y") ? "Địa hình" : "Vệ tinh" }}</span
            >
          </button>
        </LControl>
      </LMap>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  z-index: 9999;
  overflow-x: hidden;
  overflow-y: auto;
  color: black;
  background-color: white; /* Adjust to your preferred background color */
  width: 100%;
  max-width: 400px; /* Adjust the width as needed */
  height: 100vh;
  position: fixed;
  top: 0;
  left: -400px; /* Offscreen initially */
  transition: left 0.3s ease; /* Add transition animation */
}

.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

.sidebar.open {
  left: 0; /* Slide in from the left when open */
}

.sidebar.closed {
  left: -400px; /* Slide out to the left when closed */
}
</style>
