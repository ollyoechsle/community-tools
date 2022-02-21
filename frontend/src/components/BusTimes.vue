<template>
  <div class="ct-component ct-bus-times">
    <div class="bus-times" v-if="data">
      <div class="directions ct-tabs">
        <div class="ct-tab"
             v-for="(direction, index) in data.directions"
             v-bind:class="{ selected: isSelected(direction) }"
             :key="index">
          <a @click="selectDirection(direction)">
            {{ direction.label }}
          </a>
        </div>
      </div>
      <ul class="stops ct-horizontal-list">
        <li v-for="(stop, index) in data.directions[0].stops" :key="index">
          {{ stop.label }}
        </li>
      </ul>
      <table class="bus-departures">
        <thead>
        <tr>
          <th class="service">No.</th>
          <th>Toward</th>
          <th class="time">Departs</th>
        </tr>
        </thead>
        <tbody>
        <tr :class="departure.className" v-for="(departure, index) in data.departures" :key="index">
          <td class="service">{{ departure.service }}</td>
          <td>{{ departure.destination }}</td>
          <td class="time">
            <time>
              {{ departure.time }}
            </time>
            <div class="inTime">{{ departure.inTime }}</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="error" class="ct-error-message">
      {{ error }}
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import axios, {AxiosResponse} from 'axios'
import {BusResponse, DirectionDefinition} from "@/model/model";
import Loading from "@/components/Loading.vue";

@Component({
  components: {
    Loading
  }
})
export default class BusTimes extends Vue {

  @Prop({required: true})
  public location?: string;

  @Prop({required: true})
  public defaultStop?: string;

  public selectedDirection: any = null;

  private loading = false;
  private data: BusResponse | null = null
  private error? = ""

  public mounted() {
    this.loadData(this.location!, this.defaultStop!)
  }

  public loadData(location: string, stopId: string) {
    this.loading = true;
    this.error = undefined
    this.data = null
    const url = `http://localhost:8080/buses?location=${location}&stop=${stopId}`
    axios.get(url).then(
        (response: AxiosResponse<BusResponse>) => {
          this.data = response.data
          this.loading = false;
        },
        (error) => {
          this.error = "Unable to load bus times. " + error
          this.loading = false;
        })
  }

  public selectDirection(direction: DirectionDefinition) {
    this.selectedDirection = direction;
  }

  public isSelected(direction: DirectionDefinition) {
    return direction == this.selectedDirection;
  }

}
</script>

<style>
.ct-tabs .ct-tab {
  display: inline-flex;
}

.ct-tabs .ct-tab.selected {
  background: red;
}

</style>